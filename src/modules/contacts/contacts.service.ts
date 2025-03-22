import { DB } from '@database/index';

const Contact = DB.Contacts;
export const createBulkContacts = async (contacts: any) => {
    const createdContacts = await Contact.bulkCreate(contacts);
    return createdContacts;
};

export const getAllContacts = async (query: any) => {
    const contacts = await Contact.findAll(query);
    return contacts;
};
