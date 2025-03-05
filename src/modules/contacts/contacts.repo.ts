import { DB } from '@/database';
import { Contacts } from '@/interfaces/contacts.interfaces';

const repo = {
    createContact: async (contactData:Contacts):Promise<Contacts>=>{
        return await DB.Contacts.create(contactData);
    }
}

export default repo;