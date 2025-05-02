import express from 'express';
import {
    createContact,
    deleteContactsBulk,
    getAllContacts,
    updateAudienceForCampaignByFileId,
} from './contacts.controller';
import { requiresAuth } from '@/middlewares/auth0.middleware';
const contactRouter = express.Router();

// Define API routes
contactRouter.get('/:fileId', requiresAuth, getAllContacts);
contactRouter.post('/create/:fileId', requiresAuth, createContact);
contactRouter.delete('/delete/bulk-delete', requiresAuth, deleteContactsBulk);
contactRouter.put('/:fileId', requiresAuth, updateAudienceForCampaignByFileId);
export default contactRouter;
