import * as mailboxRepo from '@/modules/mailboxes/mailboxes.repo';
import { Request, Response } from 'express';
import { MailboxType } from '@/interfaces/mailboxes.interfaces';
import { getUserProfile } from '@/modules/user/user.service';
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

export const getAllMailboxes = async (req: Request, res: Response) => {
    const owner = req.user?.sub;
    if (!owner) {
        throw new Error('Unauthorized');
    }
    const mailboxes = await mailboxRepo.getAllMailboxes(owner);
    const ownerInfo = await getUserProfile(owner);
    const mailBoxesData = [];
    for (const mailbox of mailboxes) {
        mailBoxesData.push({
            ...mailbox,
            created_by: ownerInfo.nickname,
        });
    }
    res.status(200).json({ mailboxes: mailBoxesData });
};
