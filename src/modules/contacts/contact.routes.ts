import express from 'express';
import {
    getAllContacts,
    createContact,
    getContactByFileId,
} from './contacts.controller';
import { requiresAuth } from '@/middlewares/auth0.middleware';
const contactRouter = express.Router();

// Define API routes
// contactRouter.get('/contacts', requiresAuth, getAllContacts);
contactRouter.get('/:fileId', requiresAuth, getContactByFileId);
contactRouter.post('/create/:fileId', requiresAuth, createContact);

export default contactRouter;
