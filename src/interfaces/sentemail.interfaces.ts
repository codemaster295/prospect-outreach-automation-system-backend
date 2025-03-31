export interface SentEmail {
    id?: string;
    messageId: string;
    campaignId?: string;
    from?: string;
    to?: string;
    subject?: string;
    email?: string;
    template?: string;
    owner?: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
}
