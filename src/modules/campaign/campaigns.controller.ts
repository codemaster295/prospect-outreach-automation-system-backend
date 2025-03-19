import { Request, Response } from 'express';
import {
    createCampaignService,
    getAllCampaignService,
    getCampaignByIdService,
    deleteCampaignById,
    updateCampaignById,
} from './campaigns.service';

// export const getAllCampaignController = async (req: Request, res: Response): Promise<void> => {
//    try {
//           const authorization = req.headers.authorization;

//           if (!authorization) {
//               res.status(404).json({ message: 'campaigns not found' });
//               return;
//           }
//           const accessToken = authorization.split(' ')[1];

//           const campaigns = await getAllCampaignService(accessToken);
//           res.status(200).json({
//               message: 'Data retrieved successfully',
//               campaigns,
//           });
//       } catch (error: any) {
//           console.error('Error in getAllCampaignController:', error);
//           res.status(500).json({
//               error: 'Failed to retrieve campaigns',
//               details: error.message,
//           });
//       }
//   };
export const getAllCampaignsController = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const campaigns = await getAllCampaignService();
        res.status(200).json({
            message: 'Campaigns retrieved successfully',
            campaigns,
        });
    } catch (error: any) {
        console.error('Error in getAllCampaignsController:', error);
        res.status(500).json({
            error: 'Failed to retrieve campaigns',
            details: error.message,
        });
    }
};
export const getCampaignByIdController = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const campaign = await getCampaignByIdService(Number(id));

        if (!campaign) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }

        res.status(200).json({
            message: 'Campaign retrieved successfully',
            campaign,
        });
    } catch (error: any) {
        console.error('Error in getCampaignByIdController:', error);
        res.status(500).json({
            error: 'Failed to retrieve campaign',
            details: error.message,
        });
    }
};
export const createCampaignController = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { name } = req.body;

        if (!name) {
            res.status(400).json({ message: 'Name is required' });
            return;
        }

        // Pass individual arguments instead of an object
        const newCampaign = await createCampaignService(name);
        res.status(201).json({
            message: 'Campaign created successfully',
            campaign: newCampaign,
        });
    } catch (error: any) {
        console.error('Error in createCampaignController:', error);
        res.status(500).json({
            error: 'Failed to create campaign',
            details: error.message,
        });
    }
};
export const updateCampaignController = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedCampaign = await updateCampaignById(Number(id), req.body);

        res.status(200).json({
            message: 'Campaign updated successfully',
            campaign: updatedCampaign,
        });
    } catch (error: any) {
        console.error('Error in updateCampaignController:', error);
        res.status(500).json({
            error: 'Failed to update campaign',
            details: error.message,
        });
    }
};
export const deleteCampaignController = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        await deleteCampaignById(id);
    } catch (error: any) {
        console.error('Error in deleteCampaignController:', error);
        res.status(500).json({
            error: 'Failed to delete campaign',
            details: error.message,
        });
    }
};
