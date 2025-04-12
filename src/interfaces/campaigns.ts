export interface Campaigns {
    id?: string;
    name: string;
    audience: string | null;
    template: string | null;
    delay: {
        interval: number;
        unit: string;
    };
    mailbox: string | null;
    status: string;
    owner: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
}
