import express from 'express';
import { getSchedules } from './schedules.controllers';

const scheduleRouter = express.Router();

scheduleRouter.get('/campaign/:id', getSchedules);

export default scheduleRouter;
