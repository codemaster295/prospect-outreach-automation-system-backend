import express from 'express';
import {
    getAllContactsController,
    createContactController,
} from './contacts.controller';

const contactRouter = express.Router();

// Define API routes
contactRouter.get('/contact', getAllContactsController);
contactRouter.post('/create', createContactController);

export default contactRouter;
