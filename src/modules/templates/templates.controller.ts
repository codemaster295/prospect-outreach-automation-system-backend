import { Request, Response } from 'express';
import {
    getAllTemplate,
    getTemplateById,
    createTemplate,
    updateTemplateById,
    deleteTemplate,
    getTemplatesByUser,
    getTemplate,
} from './templates.service';
import { updateCampaignById } from '../campaign/campaigns.service';
import { CustomError } from '@/utils/custom-error';
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
        const owner = req.user?.sub;
        if (!owner) {
            throw new CustomError('Unauthorized', 401);
        }
        const { data, campaignId } = req.body;
        const { subject, body, name } = data;

        if (!subject || !body) {
            throw new CustomError('Subject and body are required', 400);
        }

        const newTemplate = await createTemplate({
            subject,
            body,
            owner,
            name,
        });
        if (campaignId) {
            await updateCampaignById(campaignId, { template: newTemplate.id });
        }
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
        const owner = req.user?.sub;
        if (!owner) {
            throw new CustomError('Unauthorized', 401);
        }
        const { id } = req.params;
        const { subject, body, name } = req.body;
        const template = await getTemplate({ where: { id, owner } });
        if (!template) {
            throw new CustomError('Template not found', 404);
        }
        const updatedTemplate = await updateTemplateById(id, {
            subject,
            body,
            name,
        });
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
