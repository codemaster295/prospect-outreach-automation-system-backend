import { DB } from '@/database';
import { ContactFiles } from '@/interfaces/contactFiles.interfaces';

const repo = {
    createContact: async (contactFileData:ContactFiles):Promise<ContactFiles>=>{
        return await DB.ContactFiles.create(contactFileData);
    }
}

export default repo;