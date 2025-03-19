import { Request, Response } from 'express';
import {
    createCampaign,
    getAllCampaign,
    getCampaignById,
    deleteCampaignById,
    updateCampaignById,
} from './campaigns.service';

export const getAllCampaigns = async (
    req: Request,
    res: Response,
): Promise<void> => {
    try {
        const campaigns = await getAllCampaign();
        res.status(200).json({
            message: 'Campaigns retrieved successfully',
            campaigns,
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
        const campaign = await getCampaignById(Number(id));

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

        // Pass individual arguments instead of an object
        const newCampaign = await createCampaign(name);
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
        const updatedCampaign = await updateCampaignById(Number(id), req.body);

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
        await deleteCampaignById(id);
    } catch (error: any) {
        console.error('Error in deleteCampaigns:', error);
        res.status(500).json({
            error: 'Failed to delete campaign',
            details: error.message,
        });
    }
};
