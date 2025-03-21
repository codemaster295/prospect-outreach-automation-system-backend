import { DB } from '@/database/index';
import { MailboxType } from '@/interfaces/mailboxes.interfaces';
const Mailbox = DB.Mailbox;

export const createMailbox = async (
    senderEmail: string,
    provider: MailboxType,
    owner: string,
) => {
    const mailbox = await Mailbox.create({ senderEmail, provider, owner });
    return mailbox;
};
