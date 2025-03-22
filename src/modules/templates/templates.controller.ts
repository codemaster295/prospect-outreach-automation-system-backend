import { Request, Response } from 'express';
import {
    getAllTemplate,
    getTemplateById,
    createTemplate,
    updateTemplateById,
    deleteTemplate,
    getTemplatesByUser,
} from './templates.service';

export const getTemplatesUser = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        // const templates = await getAllTemplate();

        const userId = req.user?.sub; // `sub` is typically used for user ID in JWT

        if (!userId) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const templates = await getTemplatesByUser(userId);

        res.status(200).json({
            message: 'User Templates retrieved successfully',
            templates,
        });
    } catch (error: any) {
        console.error('Error in getTemplatesUser:', error);
        res.status(500).json({
            error: 'Failed to retrieve templates',
            details: error.message,
        });
    }
};
export const getAllTemplates = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const templates = await getAllTemplate();

        res.status(200).json({
            message: 'Templates retrieved successfully',
            templates,
        });
    } catch (error: any) {
        console.error('Error in getAllTemplates:', error);
        res.status(500).json({
            error: 'Failed to retrieve templates',
            details: error.message,
        });
    }
};
export const getTemplateId = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const template = await getTemplateById(id);

        if (!template) {
            res.status(404).json({ message: 'Template not found' });
            return;
        }

        res.status(200).json({
            message: 'Template retrieved successfully',
            template,
        });
    } catch (error: any) {
        console.error('Error in getTemplateById:', error);
        res.status(500).json({
            error: 'Failed to retrieve template',
            details: error.message,
        });
    }
};
export const createTemplates = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        // const userId = req.user?.sub; // `sub` is typically used for user ID in JWT

        // if (!userId) {
        //      res.status(404).json({ error: 'User not found' });
        //      return;
        // }
        const owner = req.user?.sub;
        const { subject, body } = req.body;

        if (!subject || !body || !owner) {
            res.status(400).json({
                message: 'Subject, body, and owner are required',
            });
            return;
        }

        const newTemplate = await createTemplate(subject, body, owner);
        res.status(201).json({
            message: 'Template created successfully',
            template: newTemplate,
        });
    } catch (error: any) {
        console.error('Error in createTemplate:', error);
        res.status(500).json({
            error: 'Failed to create template',
            details: error.message,
        });
    }
};

export const updateTemplates = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const { subject, body, owner } = req.body;

        if (owner !== undefined) {
            res.status(403).json({
                message: 'Updating owner field is not allowed',
            });
            return;
        }

        const updatedTemplate = await updateTemplateById(id, subject, body);
        if (!updatedTemplate) {
            res.status(404).json({ message: 'Template not found' });
            return;
        }
        res.status(200).json({
            message: 'Template updated successfully',
            template: updatedTemplate,
        });
    } catch (error: any) {
        console.error('Error in updateTemplate:', error);
        res.status(500).json({
            error: 'Failed to update template',
            details: error.message,
        });
    }
};
export const deleteTemplates = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;

        const deletedTemplate = await deleteTemplate(id);
        if (!deletedTemplate) {
            res.status(404).json({ message: 'Template not found' });
            return;
        }

        res.status(200).json({
            message: 'Template deleted successfully',
        });
    } catch (error: any) {
        console.error('Error in deleteTemplate:', error);
        res.status(500).json({
            error: 'Failed to delete template',
            details: error.message,
        });
    }
};
