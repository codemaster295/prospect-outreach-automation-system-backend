export interface Campaigns {
    id?: string;
    name: string;
    audience?: string;
    template?: string;
    delay?: {
        interval: number;
        unit: string;
    };
    mailbox?: string;
    status?: string;
    owner?: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
}
