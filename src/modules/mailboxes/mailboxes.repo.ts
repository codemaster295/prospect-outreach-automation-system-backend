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

export const getMailbox = async (
    email: string,
    owner: string,
    additionalWhere: any = {},
) => {
    const mailbox = await Mailbox.findOne({
        where: { senderEmail: email, owner, ...additionalWhere },
    });
    return mailbox;
};

export const getAllMailboxes = async (owner: string) => {
    // cleaned response from sequelize
    const mailboxes = await Mailbox.findAll({
        where: { owner },
        raw: true,
    });
    return mailboxes;
};
