import express from 'express';
import {
    getAllTemplates,
    getTemplateId,
    createTemplates,
    updateTemplates,
    deleteTemplates,
    getTemplatesUser,
    deleteTemplatesBulk,
} from './templates.controller';
import { requiresAuth } from '@/middlewares/auth0.middleware';
const templateRouter = express.Router();

templateRouter.get('/', requiresAuth, getAllTemplates);

// Get template by ID
templateRouter.get('/:id', requiresAuth, getTemplateId);
templateRouter.get('/:userid', requiresAuth, getTemplatesUser);

// Create a new template
templateRouter.post('/', requiresAuth, createTemplates);

// Update an existing template
templateRouter.put('/:id', requiresAuth, updateTemplates);

// Delete a template (soft delete)
templateRouter.delete('/:id', requiresAuth, deleteTemplates);
templateRouter.delete('/delete/bulkdelete', requiresAuth, deleteTemplatesBulk);

export default templateRouter;
