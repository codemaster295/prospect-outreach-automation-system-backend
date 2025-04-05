import * as mailboxRepo from '@/modules/mailboxes/mailboxes.repo';
import * as campaignService from '@/modules/campaign/campaigns.service';
import { Request, Response } from 'express';
import { MailboxType } from '@/interfaces/mailboxes.interfaces';
import { getUserProfile } from '@/modules/user/user.service';
import { testSMTPConnection, testImapConnection } from './mailboxes.services';
export const createMailbox = async (req: Request, res: Response) => {
    try {
        const { senderEmail, provider } = req.body;
        const owner = req.user?.sub;
        if (!owner) {
            throw new Error('Unauthorized');
        }
        const mailbox = await mailboxRepo.createMailbox(
            senderEmail,
            provider,
            owner,
        );
        res.status(201).json({
            message: 'Mailbox created successfully',
            mailbox,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getMailboxes = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const { provider } = req.query;
        const owner = req.user?.sub;
        if (!owner) {
            throw new Error('Unauthorized');
        }
        const mailbox = await mailboxRepo.getMailbox({
            where: {
                senderEmail: email,
                owner,
                provider: provider as MailboxType,
            },
        });
        res.status(200).json({ mailbox });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAllMailboxes = async (req: Request, res: Response) => {
    const owner = req.user?.sub;
    if (!owner) {
        throw new Error('Unauthorized');
    }
    const mailboxes = await mailboxRepo.getAllMailboxes({
        where: { owner },
    });
    const ownerInfo = await getUserProfile(owner);
    const mailBoxesData = [];
    for (const mailbox of mailboxes) {
        mailBoxesData.push({
            ...mailbox.dataValues,
            created_by: ownerInfo.nickname,
        });
    }
    res.status(200).json({ mailboxes: mailBoxesData });
};
export const assignMailbox = async (req: Request, res: Response) => {
    try {
        const { campaignId, mailboxId } = req.body;
        const owner = req.user?.sub;
        if (!owner) {
            throw new Error('Unauthorized');
        }
        const mailbox = await mailboxRepo.getMailbox({
            where: { id: mailboxId, owner },
        });
        if (!mailbox) {
            throw new Error('Mailbox not found');
        }
        const campaign = await campaignService.getCampaign({
            where: { id: campaignId, owner },
        });
        if (!campaign) {
            throw new Error('Campaign not found');
        }
        const campaignUpdate = await campaignService.updateCampaignById(
            campaignId,
            {
                mailbox: mailboxId,
            },
        );
        res.status(200).json({
            message: 'Mailbox assigned to campaign successfully',
            campaignUpdate,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getMailboxById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const owner = req.user?.sub;
        if (!owner) {
            throw new Error('Unauthorized');
        }
        const mailbox = await mailboxRepo.getMailbox({
            where: { id, owner },
            raw: true,
        });
        const userProfile = await getUserProfile(owner);
        if (!mailbox) {
            throw new Error('Mailbox not found');
        }
        res.status(200).json({
            mailbox: {
                ...mailbox,
                created_by: userProfile.nickname,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const testConnection = async (req: Request, res: Response) => {
    try {
        const { type, config = {} } = req.body;
        if (!type) {
            throw new Error('Specify a test type, (SMTP/IMAP)');
        }
        ['host', 'port', 'auth.user', 'auth.pass'].forEach(path => {
            const value = path.split('.').reduce((o, i) => o?.[i], config);
            if (!value)
                throw new Error(`Missing required field: config.${path}`);
        });
        config.port = parseInt(config.port);
        switch (type.toLowerCase()) {
            case 'smtp':
                await testSMTPConnection({
                    host: config.host,
                    port: config.port,
                    auth: {
                        user: config.auth.user,
                        pass: config.auth.pass,
                    },
                });
                break;
            case 'imap':
                await testImapConnection({
                    host: config.host,
                    port: config.port,
                    auth: {
                        user: config.auth.user,
                        pass: config.auth.pass,
                    },
                });
                break;
            default:
                throw new Error('Invalid test type');
        }
        res.status(200).json('ok');
    } catch (error) {
        res.status(500).json({
            message: (error as any)?.response || 'Internal server error',
        });
    }
};
