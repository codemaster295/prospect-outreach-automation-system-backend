import { DB } from '@/database/index';
import { mailboxConfig } from '@/interfaces/mailboxconfig.interfaces';
const MailboxConfig = DB.MailboxConfig;
export const createOrUpdateMailboxConfig = async (
    config: mailboxConfig,
    mailboxId: string,
    owner: string,
) => {
    const mailboxConfig = await MailboxConfig.findOne({
        where: { mailbox: mailboxId, key: config.key, owner },
    });
    if (mailboxConfig) {
        await MailboxConfig.update(
            { value: config.value },
            { where: { id: mailboxConfig.id } },
        );
    } else {
        await MailboxConfig.create({ ...config, mailbox: mailboxId, owner });
    }

    return true;
};
