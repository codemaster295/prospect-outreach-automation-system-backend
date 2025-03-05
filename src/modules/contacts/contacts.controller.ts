import { Request, Response } from 'express';
import ContactService, { getContactService } from './contacts.service';
import axios from 'axios';
import { getFile } from '../files/files.service';

export const getAllContactsController = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            res.status(404).json({ message: 'contact not found' });
            return;
        }
        const accessToken = authorization.split(' ')[1];

        const contacts = await getContactService(accessToken);
        res.status(200).json({
            message: 'Data retrieved successfully',
            contacts,
        });
    } catch (error: any) {
        console.error('Error in getAllContactsController:', error);
        res.status(500).json({
            error: 'Failed to retrieve contacts',
            details: error.message,
        });
    }
};

export const createContactController = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const { fileId, mappings } = req.body;
        const file = await getFile(fileId);
        if (!file) {
            res.status(404).json({ error: 'File not found' });
            return;
        }
        const fileUrl = file.fileUrl;
        //check if file is a csv file and if not return error
        const fileData = await axios.get(fileUrl, {
            responseType: 'arraybuffer',
        });
        const fileType = fileData.headers['content-type'];
        if (fileType !== 'text/csv') {
            res.status(400).json({ error: 'Invalid file type' });
            return;
        }
        //read the buffer as CSV and parse it
        const csvData = new TextDecoder().decode(fileData.data);
        const contacts = csvData
            ?.split('\n')
            .map((line: string) => line.split(','));

        // take first row as header and rest as data
        const header = contacts[0];
        const data = contacts.slice(1);

        //map the header to the data with mappings
        const mappedData = data.map((row: string[]) => {
            const data: any = {};
            for (let i = 0; i < header.length; i++) {
                data[header[i]] = row[i];
            }
            return data;
        });

        //combine the mapped data with the mappings
        const combinedData = mappedData.map((row: any) => {
            return Object.keys(mappings).reduce((acc: any, curr: any) => {
                acc[curr] = row[mappings[curr]];
                return acc;
            }, {});
        });
        const prepareData = [];
        for (let i = 0; i < combinedData.length; i++) {
            if (combinedData[i].email) {
                prepareData.push({
                    ...combinedData[i],
                    userId: userId,
                    fileId: fileId,
                });
            }
        }
        const createdContacts = await ContactService.createBulkContacts(
            prepareData,
        );
        res.status(200).json({
            message: 'Contacts created successfully',
            createdContacts,
        });
    } catch (error: any) {
        console.error('Error in createContactController:', error);
        res.status(500).json({
            error: 'Failed to create contact',
            details: error.message,
        });
    }
};

export const getContactByIdController = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const contact = await ContactService.getContactById(id);
        if (!contact) res.status(404).json({ error: 'Contact not found' });

        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve contact' });
    }
};

// const ContactController = {
//   // Get all contacts
//   async getAllContacts(req: Request, res: Response): Promise<Response> {
//     try {
//       const contacts = await ContactService.getAllContacts();
//       return res.status(200).json(contacts);
//     } catch (error) {
//       return res.status(500).json({ error: 'Failed to retrieve contacts' });
//     }
//   },

//   // Get a contact by ID
//   async getContactById(req: Request, res: Response): Promise<Response> {
//     try {
//       const { id } = req.params;
//       const contact = await ContactService.getContactById(id);
//       if (!contact) return res.status(404).json({ error: 'Contact not found' });

//       return res.status(200).json(contact);
//     } catch (error) {
//       return res.status(500).json({ error: 'Failed to retrieve contact' });
//     }
//   },

//   // Create a new contact
//   async createContact(req: Request, res: Response): Promise<Response> {
//     try {
//       const newContact = await ContactService.createContact(req.body);
//       return res.status(201).json(newContact);
//     } catch (error) {
//       return res.status(500).json({ error: 'Failed to create contact' });
//     }
//   },

//   // Update a contact
//   async updateContact(req: Request, res: Response): Promise<Response> {
//     try {
//       const { id } = req.params;
//       const updatedContact = await ContactService.updateContact(id, req.body);
//       if (!updatedContact) return res.status(404).json({ error: 'Contact not found' });

//       return res.status(200).json(updatedContact);
//     } catch (error) {
//       return res.status(500).json({ error: 'Failed to update contact' });
//     }
//   },

//   // Soft delete a contact
//   async deleteContact(req: Request, res: Response): Promise<Response> {
//     try {
//       const { id } = req.params;
//       const deleted = await ContactService.deleteContact(id);
//       if (!deleted) return res.status(404).json({ error: 'Contact not found' });

//       return res.status(200).json({ message: 'Contact deleted successfully' });
//     } catch (error) {
//       return res.status(500).json({ error: 'Failed to delete contact' });
//     }
//   },
// };

// export default ContactController;
