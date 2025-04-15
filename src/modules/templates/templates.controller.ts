import { Request, Response } from 'express';
import {
    getAllTemplate,
    getTemplateById,
    createTemplate,
    updateTemplateById,
    deleteTemplate,
    getTemplatesByUser,
    getTemplate,
    getPaginatedTemplate,
    deleteTemplateBulk,
} from './templates.service';
import { updateCampaignById } from '../campaign/campaigns.service';
import { CustomError } from '@/utils/custom-error';
import { Op, fn, col, where } from 'sequelize';

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
      const owner = req.user?.sub
  
      if (!owner) {
        res.status(401).json({ message: 'Unauthorized' })
        return
      }
  
      const search = (req.query.search as string) || ''
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const offset = (page - 1) * limit
  
      console.log('[TEMPLATE] Params =>', { search, page, limit, offset, owner })
  
      const searchFilter = search
        ? {
            [Op.or]: [
              where(fn('LOWER', col('name')), 'LIKE', `%${search.toLowerCase()}%`),
              // Add more fields if needed:
              // where(fn('LOWER', col('subject')), 'LIKE', `%${search.toLowerCase()}%`),
            ],
          }
        : {}
  
      const { rows: templates, count: total } = await getPaginatedTemplate({
        where: {
          owner,
          ...searchFilter,
        },
        offset,
        limit,
        order: [['createdAt', 'DESC']],
      })
  
      console.log('[TEMPLATE] Found templates:', templates.length)
  
      res.status(200).json({
        message: 'Templates retrieved successfully',
        data: templates,
        pagination: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          perPage: limit,
        },
      })
    } catch (error: any) {
      console.error('[TEMPLATE] Error in getAllTemplates:', error)
      res.status(500).json({
        error: 'Failed to retrieve templates',
        details: error.message,
      })
    }
  }

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
export const deleteTemplatesBulk = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user?.sub;
      const { ids } = req.body;
  
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
  
      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ error: 'No template IDs provided' });
        return;
      }
  
      const deletedCount = await deleteTemplateBulk({
        where: {
          id: {
            [Op.in]: ids,
          },
          owner: userId,
        },
      });
  
      res.status(200).json({
        message: 'Templates deleted successfully',
        deletedCount,
      });
    } catch (error: any) {
      console.error('Error in deleteTemplatesBulk:', error);
      res.status(500).json({
        error: 'Failed to delete templates',
        details: error.message,
      });
    }
  };
  