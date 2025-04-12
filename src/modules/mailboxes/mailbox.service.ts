import { DB } from '@/database/index';
import { updateCampaignById } from '../campaign/campaigns.service';
const Mailbox = DB.Mailbox;

export const disconnectMailboxService = async (
    mailboxId: string,
    ownerId: string,
) => {
    const mailbox = await Mailbox.findOne({
        where: {
            id: mailboxId,
            owner: ownerId,
        },
    });

    if (!mailbox) {
        throw new Error('MAILBOX_NOT_FOUND');
    }
    await Mailbox.destroy({
        where: {
            id: mailboxId,
        },
    });
};
