import express from 'express';
import {
    getAllCampaignsController,
    getCampaignByIdController,
    createCampaignController,
    updateCampaignController,
    deleteCampaignController,
} from './campaigns.controller';

const campaignRouter = express.Router();

// Get all campaigns
campaignRouter.get('/', getAllCampaignsController);

// Get campaign by ID
campaignRouter.get('/:id', getCampaignByIdController);

// Create a new campaign
campaignRouter.post('/create', createCampaignController);

// Update a campaign
campaignRouter.put('/:id', updateCampaignController);

// Delete a campaign
campaignRouter.delete('/:id', deleteCampaignController);

export default campaignRouter;
