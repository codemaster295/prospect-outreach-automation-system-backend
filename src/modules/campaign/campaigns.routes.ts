import express from 'express';
import {
    getAllCampaignsController,
    getCampaignByIdController,
    createCampaignController,
} from './campaigns.controller';

const campaignRouter = express.Router();

// Get all campaigns
campaignRouter.get('/', getAllCampaignsController);

// Get campaign by ID
campaignRouter.get('/:id', getCampaignByIdController);

// Create a new campaign
campaignRouter.post('/', createCampaignController);

export default campaignRouter;
