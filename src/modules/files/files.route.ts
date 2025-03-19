import express from 'express';
import {
    getAllFile,
    generatePresignedByUrl,
    redirectToFile,
} from './files.controller';
import { requiresAuth } from '@/middlewares/auth0.middleware';
const filesRouter = express.Router();

// Define API routes
filesRouter.get(
    '/generate-presigned-url',
    requiresAuth,
    generatePresignedByUrl,
);
filesRouter.post('/create-file', requiresAuth, getAllFile);
filesRouter.get('/:userId/:uuid', redirectToFile);

export default filesRouter;
