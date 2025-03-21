import * as mailboxRepo from '@/modules/mailboxes/mailboxes.repo';
import * as mailboxConfigRepo from '@/modules/mailbox-config/mailboxes-config.repo';
import { Request, Response } from 'express';

export const createMailbox = async (req: Request, res: Response) => {
    try {
        const { senderEmail, provider, config } = req.body;
        const owner = req.user?.sub;
        if (!owner) {
            throw new Error('Unauthorized');
        }
        const mailbox = await mailboxRepo.createMailbox(
            senderEmail,
            provider,
            owner,
        );
        if (!mailbox.id) {
            throw new Error('Mailbox not created');
        }
        await mailboxConfigRepo.createOrUpdateMailboxConfig(
            config,
            mailbox.id,
            owner,
        );
        res.status(201).json({ message: 'Mailbox created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
