import { DB } from '@/database/index';

const MailboxConfig = DB.MailboxConfig;

export const disconnectMailboxconfigService = async (mailboxId: string) => {

    await MailboxConfig.destroy({
        where: { mailbox: mailboxId },
    });
};
