import { Request, Response } from 'express';
import {
    createCampaign,
    getAllCampaign,
    deleteCampaignById,
    updateCampaignById,
    getCampaign,
    campaignLaunch,
} from './campaigns.service';
import { getUserProfile } from '../user/user.service';

export const getAllCampaigns = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const owner = req.user?.sub;
        if (!owner) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const campaigns = await getAllCampaign({
            where: {
                owner,
            },
            include: [
                {
                    association: 'sending_account',
                    attributes: ['id', 'senderEmail'],
                },
            ],
            attributes: [
                'id',
                'name',
                'createdAt',
                'updatedAt',
                'status',
                'mailbox',
            ],
        });
        const user = await getUserProfile(owner);
        const campaignsData = [];
        for (const campaign of campaigns) {
            campaignsData.push({
                ...campaign.dataValues,
                created_by: user.nickname,
            });
        }
        res.status(200).json({
            message: 'Campaigns retrieved successfully',
            campaigns: campaignsData,
        });
    } catch (error: any) {
        console.error('Error in getAllCampaigns:', error);
        res.status(500).json({
            error: 'Failed to retrieve campaigns',
            details: error.message,
        });
    }
};
export const getCampaignId = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const owner = req.user?.sub;
        if (!owner) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const campaign = await getCampaign({
            where: {
                id,
                owner,
            },
            attributes: [
                'id',
                'name',
                'audience',
                'template',
                'mailbox',
                'status',
                'createdAt',
                'updatedAt',
            ],
        });

        if (!campaign) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }

        res.status(200).json({
            message: 'Campaign retrieved successfully',
            campaign,
        });
    } catch (error: any) {
        console.error('Error in getCampaignId:', error);
        res.status(500).json({
            error: 'Failed to retrieve campaign',
            details: error.message,
        });
    }
};
export const createCampaigns = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { name } = req.body;

        if (!name) {
            res.status(400).json({ message: 'Name is required' });
            return;
        }
        const owner = req.user?.sub;
        if (!owner) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Pass individual arguments instead of an object
        const newCampaign = await createCampaign({
            name,
            owner,
        });
        console.log(newCampaign, 'newCampaign');
        res.status(201).json({
            message: 'Campaign created successfully',
            campaign: newCampaign,
        });
    } catch (error: any) {
        console.error('Error in createCampaign:', error);
        res.status(500).json({
            error: 'Failed to create campaign',
            details: error.message,
        });
    }
};
export const updateCampaign = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        const owner = req.user?.sub;
        if (!owner) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const updatedCampaign = await updateCampaignById(id, req.body);

        res.status(200).json({
            message: 'Campaign updated successfully',
            campaign: updatedCampaign,
        });
    } catch (error: any) {
        console.error('Error in updateCampaign:', error);
        res.status(500).json({
            error: 'Failed to update campaign',
            details: error.message,
        });
    }
};
export const deleteCampaign = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;

        const owner = req.user?.sub;
        if (!owner) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const campaign = await getCampaign({
            where: {
                id,
                owner,
            },
        });
        if (!campaign) {
            res.status(404).json({ message: 'Campaign not found' });
            return;
        }
        await deleteCampaignById(id);
        res.status(200).json({
            message: 'Campaign deleted successfully',
        });
    } catch (error: any) {
        console.error('Error in deleteCampaigns:', error);
        res.status(500).json({
            error: 'Failed to delete campaign',
            details: error.message,
        });
    }
};
export const launchCampaign = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
             res.status(400).json({ error: 'campaignId is required' });
             return;
        }
        const result = await campaignLaunch(id);
         res.status(200).json(result);
         return;
    } catch (error:any) {
         res.status(500).json({ error: error.message });
         return;
    }
};
export default {
    getAllCampaigns,
    getCampaignId,
    createCampaigns,
    updateCampaign,
    deleteCampaign,
    launchCampaign,
};