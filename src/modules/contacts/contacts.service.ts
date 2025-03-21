import { DB } from '@database/index';
import repo from './contacts.repo';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';
const Contact = DB.Contacts;
// DB.sequelize.sync({ force: false });
// Adjust the path as needed

export const getContact = async (accessToken: string) => {
    const decodeToken = await verifyJWT(
        accessToken,
        JWT_ACCESS_TOKEN_SECRET as string,
    );

    const contactid = decodeToken.contactid;
    try {
        const contacts = await Contact.findAll(contactid);
        return contacts;
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw new Error('Database query failed');
    }
};

class ContactService {
    async getAllContacts() {
        try {
            const contacts = await Contact.findAll();
            return contacts;
        } catch (error) {
            console.error('Error fetching contacts:', error);
            throw new Error('Database query failed');
        }
    }

    async getContactById(id: string) {
        return await Contact.findByPk(id);
    }

    async createContact(data: any) {
        return await Contact.create(data);
    }

    async createBulkContacts(data: any) {
        return await Contact.bulkCreate(data);
    }

    async deleteContact(id: string) {
        return await Contact.destroy({ where: { id } });
    }
}

export default new ContactService();
