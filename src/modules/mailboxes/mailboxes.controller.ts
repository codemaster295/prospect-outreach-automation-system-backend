import * as mailboxRepo from '@/modules/mailboxes/mailboxes.repo';
import { Request, Response } from 'express';
import { MailboxType } from '@/interfaces/mailboxes.interfaces';

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
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const getMailboxes = async (req: Request, res: Response) => {
    const { email } = req.params;
    const { provider } = req.query;
    const owner = req.user?.sub;
    if (!owner) {
        throw new Error('Unauthorized');
    }
    const mailbox = await mailboxRepo.getMailbox(email, owner, {
        provider: provider as MailboxType,
    });
    res.status(200).json({ mailbox });
};
