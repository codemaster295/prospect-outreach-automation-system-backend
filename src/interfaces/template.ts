export interface Template {
    id?: string;
    subject: string;
    body: string;
    owner: string;
    name: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
}
