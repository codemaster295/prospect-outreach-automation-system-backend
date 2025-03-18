import { Request, Response } from 'express';
import { createTemplateService, deleteTemplateService, getAllTemplatesService, getTemplateByIdService, updateTemplateService } from './templates.service';


// export const getAllTemplatesController = async (req: Request, res: Response): Promise<void> => {
//    try {
//           const authorization = req.headers.authorization;
  
//           if (!authorization) {
//               res.status(404).json({ message: 'Templates not found' });
//               return;
//           }
//           const accessToken = authorization.split(' ')[1];
  
//           const templates = await getAllTemplatesService(accessToken);
//           res.status(200).json({
//               message: 'Data retrieved successfully',
//               templates,
//           });
//       } catch (error: any) {
//           console.error('Error in getAllTemplatesController:', error);
//           res.status(500).json({
//               error: 'Failed to retrieve templates',
//               details: error.message,
//           });
//       }
//   };

export const getAllTemplatesController = async (req: Request, res: Response): Promise<void> => {
    try {
      const templates = await getAllTemplatesService();
      res.status(200).json({
        message: 'Templates retrieved successfully',
        templates,
      });
    } catch (error: any) {
      console.error('Error in getAllTemplatesController:', error);
      res.status(500).json({
        error: 'Failed to retrieve templates',
        details: error.message,
      });
    }
  };
  export const getTemplateByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const template = await getTemplateByIdService(id);
  
      if (!template) {
        res.status(404).json({ message: 'Template not found' });
        return;
      }
  
      res.status(200).json({
        message: 'Template retrieved successfully',
        template,
      });
    } catch (error: any) {
      console.error('Error in getTemplateByIdController:', error);
      res.status(500).json({
        error: 'Failed to retrieve template',
        details: error.message,
      });
    }
  };
  export const createTemplateController = async (req: Request, res: Response): Promise<void> => {
    try {
      const { subject, body, owner } = req.body;
  
      if (!subject || !body || !owner) {
        res.status(400).json({ message: 'Subject, body, and owner are required' });
        return;
      }
  
      const newTemplate = await createTemplateService(subject, body, owner);
      res.status(201).json({
        message: 'Template created successfully',
        template: newTemplate,
      });
    } catch (error: any) {
      console.error('Error in createTemplateController:', error);
      res.status(500).json({
        error: 'Failed to create template',
        details: error.message,
      });
    }
  };

  export const updateTemplateController = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { subject, body, owner } = req.body;
  
      if (!subject || !body || !owner) {
        res.status(400).json({ message: 'Subject, body, and owner are required' });
        return;
      }
  
      const updatedTemplate = await updateTemplateService(id, subject, body, owner);
      if (!updatedTemplate) {
        res.status(404).json({ message: 'Template not found' });
        return;
      }
        res.status(200).json({
        message: 'Template updated successfully',
        template: updatedTemplate,
      });
    } catch (error: any) {
      console.error('Error in updateTemplateController:', error);
      res.status(500).json({
        error: 'Failed to update template',
        details: error.message,
      });
    }
  };
  export const deleteTemplateController = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      const deletedTemplate = await deleteTemplateService(id);
      if (!deletedTemplate) {
        res.status(404).json({ message: 'Template not found' });
        return;
      }
  
      res.status(200).json({
        message: 'Template deleted successfully',
      });
    } catch (error: any) {
      console.error('Error in deleteTemplateController:', error);
      res.status(500).json({
        error: 'Failed to delete template',
        details: error.message,
      });
    }
  };