export enum MailboxType {
    GOOGLE = 'google',
    MICROSOFT = 'microsoft',
    CUSTOM = 'custom',
}
export interface Mailbox {
    id?: string;
    senderEmail: string;
    owner: string;
    provider: MailboxType; // Enum values
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
}
