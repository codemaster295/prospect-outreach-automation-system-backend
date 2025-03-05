import { DB } from '@database/index';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';
const ContactFiles = DB.ContactFiles;

export const getContactService = async (accessToken: string) => {
  const decodeToken = await verifyJWT(
      accessToken,
      JWT_ACCESS_TOKEN_SECRET as string,
  );

  const contactFileid = decodeToken.contactFileid;
  try {
    const contactfiles = await ContactFiles.findAll(contactFileid);
    return contactfiles;
  } catch (error) {
    console.error('Error fetching ContactFiles:', error);
    throw new Error('Database query failed');
  }

};
class ContactFilesService {
  // Get all contact files
  async getAllFiles() {
    return await ContactFiles.findAll();
  }

  // Get a single file by ID
  async getFileById(id: string) {
    return await ContactFiles.findByPk(id);
  }

  // Create a new file entry
  async createContact(fileUrl: string, uploadedBy: string) {
    return await ContactFiles.create({ fileUrl, uploadedBy });
  }
}

export default new ContactFilesService();
