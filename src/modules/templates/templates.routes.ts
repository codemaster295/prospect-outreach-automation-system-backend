import express from 'express';
import {
    createTemplateController,
    deleteTemplateController,
    getAllTemplatesController,
    getTemplateByIdController,
    updateTemplateController,
} from './templates.controller';
const templateRouter = express.Router();
templateRouter.get('/', getAllTemplatesController);

// Get template by ID
templateRouter.get('/:id', getTemplateByIdController);

// Create a new template
templateRouter.post('/', createTemplateController);

// Update an existing template
templateRouter.put('/:id', updateTemplateController);

// Delete a template (soft delete)
templateRouter.delete('/:id', deleteTemplateController);

export default templateRouter;
