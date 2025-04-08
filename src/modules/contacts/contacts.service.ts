import { DB } from '@database/index';
import { Op } from 'sequelize';

const Contact = DB.Contacts;
export const createBulkContacts = async (contacts: any) => {
    const createdContacts = await Contact.bulkCreate(contacts);
    return createdContacts;
};

export const getAllContacts = async (query: any) => {
    const contacts = await Contact.findAll(query);
    return contacts;
};
export const deleteContactsBulk = async (ids: string[]) => {
    const deletedCount = await Contact.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    return deletedCount;
  };
  export const getPaginatedContacts = (query: any) => {
    return Contact.findAndCountAll(query);
  };