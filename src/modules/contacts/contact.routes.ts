import express from 'express';
import {getAllContactsController,createContactController} from './contacts.controller';

const contactRouter = express.Router();

// Define API routes
contactRouter.get('/contact', getAllContactsController);
// router.get('/:id', ContactController.getContactById);
contactRouter.post('/contacts', createContactController);
// router.put('/:id', ContactController.updateContact);
// router.delete('/:id', ContactController.deleteContact);

export default contactRouter;
