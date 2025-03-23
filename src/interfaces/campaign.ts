export interface Campaign {
    id?: string;
    name: string;
    audience: string;
    template: string;
    delay: {
        interval: number;
        unit: string;
    };
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
}
