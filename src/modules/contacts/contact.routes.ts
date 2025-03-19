import express from 'express';
import {
    getAllContacts,
    createContact,
} from './contacts.controller';

const contactRouter = express.Router();

// Define API routes
contactRouter.get('/contact', getAllContacts);
contactRouter.post('/create', createContact);

export default contactRouter;
