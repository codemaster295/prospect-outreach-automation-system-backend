import express from 'express';
import { createContact, deleteContactsBulk, getAllContacts, getContactByFileId } from './contacts.controller';
import { requiresAuth } from '@/middlewares/auth0.middleware';
const contactRouter = express.Router();

// Define API routes
// contactRouter.get('/contacts', requiresAuth, getAllContacts);
contactRouter.get('/:fileId', requiresAuth, getContactByFileId);
contactRouter.post('/create/:fileId', requiresAuth, createContact);
contactRouter.delete('/delete/bulk-delete', requiresAuth, deleteContactsBulk);
export default contactRouter;
