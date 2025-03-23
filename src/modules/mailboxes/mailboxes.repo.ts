import { DB } from '@/database/index';
import { MailboxType } from '@/interfaces/mailboxes.interfaces';
import { FindOptions } from 'sequelize';
const Mailbox = DB.Mailbox;
export const createMailbox = async (
    senderEmail: string,
    provider: MailboxType,
    owner: string,
) => {
    const mailbox = await Mailbox.create({ senderEmail, provider, owner });
    return mailbox;
};

export const getMailbox = async (query: FindOptions) => {
    const mailbox = await Mailbox.findOne(query);
    return mailbox;
};

export const getAllMailboxes = async (query: FindOptions) => {
    // cleaned response from sequelize
    const mailboxes = await Mailbox.findAll(query);
    return mailboxes;
};
