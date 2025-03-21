import { DB } from '@/database/index';
import { mailboxConfig } from '@/interfaces/mailboxconfig.interfaces';
const MailboxConfig = DB.MailboxConfig;
export const createOrUpdateMailboxConfig = async (
    config: mailboxConfig[],
    mailboxId: string,
    owner: string,
) => {
    for (const c of config) {
        const mailboxConfig = await MailboxConfig.findOne({
            where: { mailbox: mailboxId, key: c.key, owner },
        });
        if (mailboxConfig) {
            await MailboxConfig.update(
                { value: c.value },
                { where: { id: mailboxConfig.id } },
            );
        } else {
            await MailboxConfig.create({ ...c, mailbox: mailboxId, owner });
        }
    }
    return true;
};
