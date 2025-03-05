import { DB } from '@database/index';
import repo from './contacts.repo';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';
const Contact = DB.Contacts;
DB.sequelize.sync({ force: false });
// Adjust the path as needed

export const getContactService = async (accessToken: string) => {
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
  // Fetch all contacts
  // async getAllContacts() {
  //   return await Contact.findAll();
  // }
  async getAllContacts() {
    try {
      const contacts = await Contact.findAll();
      return contacts;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw new Error('Database query failed');
    }
  }

  // Fetch a single contact by ID
  async getContactById(id: string) {
    return await Contact.findByPk(id);
  }

  // Create a new contact
  async createContact(data: any) {
    return await Contact.create(data);
  }

  // // Update an existing contact
  // async updateContact(id: string, data: any) {
  //   const [updated] = await Contact.update(data, { where: { id } });
  //   if (!updated) return null;
  //   return await Contact.findByPk(id);
  // }

  // Soft delete a contact
  async deleteContact(id: string) {
    return await Contact.destroy({ where: { id } });
  }
}

export default new ContactService();
