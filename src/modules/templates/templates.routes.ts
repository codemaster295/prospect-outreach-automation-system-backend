import express from 'express';
import {
    getAllTemplates,
    getTemplateId,
    createTemplates,
    updateTemplates,
    deleteTemplates,
    getTemplatesUser
} from './templates.controller';
const templateRouter = express.Router();

templateRouter.get('/', getAllTemplates);

// Get template by ID
templateRouter.get('/:id', getTemplateId);
templateRouter.get('/:userid', getTemplatesUser);


// Create a new template
templateRouter.post('/', createTemplates);

// Update an existing template
templateRouter.put('/:id', updateTemplates);

// Delete a template (soft delete)
templateRouter.delete('/:id', deleteTemplates);

export default templateRouter;
