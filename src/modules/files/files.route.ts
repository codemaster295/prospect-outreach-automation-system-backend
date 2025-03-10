import express from 'express';
import {
    createFileController,
    generatePresignedUrlController,
    redirectToFileController,
} from './files.controller';
import { requiresAuth } from '@/middlewares/auth0.middleware';
const filesRouter = express.Router();

// Define API routes
filesRouter.get(
    '/generate-presigned-url',
    requiresAuth,
    generatePresignedUrlController,
);
filesRouter.post('/create-file', requiresAuth, createFileController);
filesRouter.get('/:userId/:uuid', redirectToFileController);

export default filesRouter;
