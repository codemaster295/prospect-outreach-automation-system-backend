import { Request, Response } from 'express';
import ContactService, { getContactService } from './contacts.service'


// export const getAllContactsController = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const contacts = await ContactService.getAllContacts(req.body);
//         res.status(200).json({ message: "Data retrieved successfully", contacts });
//         console.log(contacts, "data get")
//     } catch (error: any) {
//         console.error('Error in getAllContactsController:', error);
//         res.status(500).json({ error: 'Failed to retrieve contacts', details: error.message });
//     }
// };

export const getAllContactsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            res.status(404).json({ message: 'contact not found' });
            return;

        }
        const accessToken = authorization.split(' ')[1];

        const contacts = await getContactService(accessToken);
        res.status(200).json({ message: "Data retrieved successfully", contacts });
        console.log(contacts, "data get")
    } catch (error: any) {
        console.error('Error in getAllContactsController:', error);
        res.status(500).json({ error: 'Failed to retrieve contacts', details: error.message });
    }
};

export const createContactController = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const newContact = await ContactService.createContact(req.body);
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create contact' });
    }
}

export const getContactByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const contact = await ContactService.getContactById(id);
        if (!contact)
            res.status(404).json({ error: 'Contact not found' });

        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve contact' });
    }
}


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
