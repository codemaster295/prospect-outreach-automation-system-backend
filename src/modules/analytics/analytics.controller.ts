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
        const { startDate, endDate } = req.query;
        const openTracking = await analyticsService.getCountAnalytics({
            where: {
                campaignId,
                key: AnalyticsKey.OPEN_TRACKING,
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
        });
        res.status(200).send({ openTracking });
    } catch (error) {
        logger.error(error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
