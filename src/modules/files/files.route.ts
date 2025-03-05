import express from 'express';
import {
    getAllFilesController,
    createFileController,
} from './files.controller';
import upload from '@/middlewares/upload.middleware';
import { requiresAuth } from '@/middlewares/auth0.middleware';
const filesRouter = express.Router();

// Define API routes
filesRouter.get('/files', getAllFilesController);
// router.get('/:id', ContactController.getContactById);
filesRouter.post('/upload', upload.single('file'), createFileController);
// router.put('/:id', ContactController.updateContact);
// router.delete('/:id', ContactController.deleteContact);

export default filesRouter;
