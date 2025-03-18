export interface Contacts {
    id?: string;
    userId: string;
    fileId: string;
    firstName: string;
    lastName: string;
    title: string;
    companyName: string;
    email: string;
    firstPhone: string;
    employees: string;
    industry: string;
    personLinkedinUrl: string;
    website: string;
    companyLinkedinUrl: string;
    companyAddress: string;
    companyCity: string;
    companyState: string;
    companyCountry: string;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    deletedAt: string | undefined;
}
