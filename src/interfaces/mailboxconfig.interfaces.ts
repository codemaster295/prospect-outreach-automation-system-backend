export interface MailboxConfig {
    id?: string;
    mailbox: string;
    key: string;
    value: string;
    owner: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
}

export interface mailboxConfig {
    key: string;
    value: string;
    mailboxId: string;
    owner: string;
}
