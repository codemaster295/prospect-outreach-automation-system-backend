import { DB } from '@/database/index';
import { mailboxConfig } from '@/interfaces/mailboxconfig.interfaces';

const MailboxConfig = DB.MailboxConfig;

export const disconnectMailboxconfigService = async (mailboxId: string) => {
    // Delete related MailboxConfig entries
    await MailboxConfig.destroy({
        where: { mailbox: mailboxId },
    });
};
