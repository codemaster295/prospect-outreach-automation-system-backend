import express from 'express';
import * as analyticController from './analytics.controller';
const analyticsRouter = express.Router();

analyticsRouter.get(
    '/:contactId/:campaignId',
    analyticController.recordOpenTracking,
);

export default analyticsRouter;
