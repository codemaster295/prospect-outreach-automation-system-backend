import { Request, Response } from 'express';
import * as sentEmailService from '@/modules/sent-emails/sent-email.services';
import * as analyticsService from '@/modules/analytics/analytics.service';
import { AnalyticsKey } from '@/interfaces/analytics.interfaces';
import logger from '@/utils/logger';
import { Op } from 'sequelize';
export const recordOpenTracking = async (req: Request, res: Response) => {
    const { contactId, campaignId } = req.params;
    const imgBuffer = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        'base64',
    );
    res.set('Content-Type', `image/png`);
    res.send(imgBuffer);
    const userAgent = req.headers['user-agent'];
    if (!userAgent || userAgent.includes('bot')) {
        logger.warn(`(User-Agent: ${userAgent}) Bot detected`);
        return;
    }
    const sentEmail = await sentEmailService.getSentEmail({
        where: {
            campaignId: campaignId,
            to: contactId,
        },
        attributes: ['id'],
    });

    if (!sentEmail?.id) {
        logger.warn(`(Sent email not found) Sent email not found`);
        return;
    }
    const isOpenTrackingRecorded = await analyticsService.getAnalytics({
        where: {
            contactId,
            sentEmailId: sentEmail.id,
            key: AnalyticsKey.OPEN_TRACKING,
        },
    });
    if (isOpenTrackingRecorded) {
        logger.warn(
            `(Open tracking already recorded) Open tracking already recorded`,
        );
        return;
    }
    await analyticsService.recordAnalytics({
        contactId,
        sentEmailId: sentEmail.id,
        campaignId: campaignId,
        key: AnalyticsKey.OPEN_TRACKING,
        value: 1,
    });
    logger.info(
        `(Open tracking recorded) Open tracking recorded for contact ${contactId} and campaign ${campaignId}`,
    );
};

export const getCampaignAnalytics = async (req: Request, res: Response) => {
    try {
        const { campaignId } = req.params;
        const startDate = req.query.startDate as string;
        const endDate = req.query.endDate as string;
        const keys = (req.query.keys as string).split(',');

        if (!keys) {
            res.status(400).send({
                message: "'keys' query parameter is required.",
            });
            return;
        }

        const parsedKeys = Array.isArray(keys)
            ? keys
            : typeof keys === 'string'
            ? [keys]
            : [];

        if (parsedKeys.length === 0) {
            res.status(400).send({
                message: 'No valid tracking keys provided.',
            });
            return;
        }

        // Run one grouped query
        const analytics = (await analyticsService.getAllAnalyticsCount({
            where: {
                campaignId,
                key: {
                    [Op.in]: parsedKeys,
                },
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
            group: ['key'],
        })) as any;

        const result: Record<string, number> = {};
        parsedKeys.forEach(key => {
            result[key] = 0;
        });

        // Fill in actual counts
        for (const row of analytics) {
            result[row.key] = Number(row.count);
        }

        res.status(200).send(result);
    } catch (error) {
        logger.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
export const recordClickTracking = async (req: Request, res: Response) => {
    const { contactId, campaignId } = req.params;
    const { link } = req.query;
    res.redirect(link as string);
    const sentEmail = await sentEmailService.getSentEmail({
        where: {
            campaignId: campaignId,
            to: contactId,
        },
        attributes: ['id'],
    });
    if (!sentEmail?.id) {
        logger.warn(`(Sent email not found) Sent email not found`);
        return;
    }
    const isClickTrackingRecorded = await analyticsService.getAnalytics({
        where: {
            contactId,
            sentEmailId: sentEmail.id,
            key: AnalyticsKey.CLICKED_TRACKING,
        },
    });
    if (isClickTrackingRecorded) {
        logger.warn(
            `(Click tracking already recorded) Click tracking already recorded`,
        );
        return;
    }
    await analyticsService.recordAnalytics({
        contactId,
        sentEmailId: sentEmail.id,
        campaignId: campaignId,
        key: AnalyticsKey.CLICKED_TRACKING,
        value: 1,
    });
    logger.info(
        `(Click tracking recorded) Click tracking recorded for contact ${contactId} and campaign ${campaignId}`,
    );
};
export const getCampaignContactsAnalytics = async (
    req: Request,
    res: Response,
) => {
    const { campaignId, trackingKey } = req.params;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    try {
        const analytics = await analyticsService.getAllAnalytics({
            where: {
                campaignId,
                key: trackingKey,
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
            include: [
                {
                    association: 'contact',
                },
                {
                    association: 'email',
                    attributes: ['id', 'subject', 'email'],
                },
            ],
            attributes: ['id', 'createdAt', 'key'],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).send(analytics);
    } catch (error) {
        console.log(error);
        logger.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
