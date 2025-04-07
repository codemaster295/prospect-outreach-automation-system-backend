import { Request, Response } from 'express';
import * as mailboxConfigRepo from './mailboxes-config.repo';
import { DB } from '@/database';
import { literal } from 'sequelize'
const Mailbox = DB.Mailbox
const Campaign = DB.Campaigns
const MailboxConfig = DB.MailboxConfig
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
export const disconnectMailbox = async (req: Request, res: Response): Promise<void> => {
  try {
    const mailboxId = req.params.mailboxId
    const ownerId = req.user?.sub

    if (!ownerId) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const mailbox = await Mailbox.findOne({
      where: {
        id: mailboxId,
        owner: ownerId,
      },
    })

    if (!mailbox) {
      res.status(404).json({ message: 'Mailbox not found or unauthorized' })
      return
    }

    await Campaign.update(
      { mailbox: null as any }, // fix null error
      { where: { mailbox: mailboxId } }
    )

    await MailboxConfig.destroy({
      where: { mailbox: mailboxId },
    })

    res.status(200).json({ message: 'Mailbox disconnected successfully' })
  } catch (error) {
    console.error('Error disconnecting mailbox:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
