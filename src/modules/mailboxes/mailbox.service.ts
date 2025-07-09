import { DB } from '@/database/index';

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
export const getPaginatedMailbox = (query: any) => {
    return Mailbox.findAndCountAll(query);
};