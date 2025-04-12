import express from 'express';
import {
    generatePresignedByUrl,
    redirectToFile,
    createFiles,
    getAllfiledata,
    deleteFilesBulk,
} from './files.controller';
import { requiresAuth } from '@/middlewares/auth0.middleware';
const filesRouter = express.Router();

// Define API routes
filesRouter.get(
    '/generate-presigned-url',
    requiresAuth,
    generatePresignedByUrl,
);
filesRouter.post('/create-file/:campaignId', requiresAuth, createFiles);
filesRouter.get('/:userId/:uuid', redirectToFile);
filesRouter.get('/', requiresAuth, getAllfiledata);
filesRouter.delete('/:bulkdelete', requiresAuth, deleteFilesBulk);
export default filesRouter;
