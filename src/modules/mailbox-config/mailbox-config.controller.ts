import { Request, Response } from 'express';
import * as mailboxConfigRepo from './mailboxes-config.repo';

export const createMailboxConfig = async (req: Request, res: Response) => {
    try {
        const { config } = req.body;
        const { mailboxId } = req.params;
        const owner = req.user?.sub;
        if (!owner) {
            throw new Error('Unauthorized');
        }
        const mailboxConfig =
            await mailboxConfigRepo.createOrUpdateMailboxConfig(
                config,
                mailboxId,
                owner,
            );
        res.status(201).json({
            message: 'Mailbox config created successfully',
            mailboxConfig,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
