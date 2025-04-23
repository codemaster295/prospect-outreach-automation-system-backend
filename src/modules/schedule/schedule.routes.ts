import express from 'express';
import { getScheduleByIds, getSchedules, updateSchedules } from './schedules.controllers';

const scheduleRouter = express.Router();

scheduleRouter.get('/campaign/:id', getSchedules);
scheduleRouter.put('/campaign/:id', updateSchedules);
scheduleRouter.get('/get-by-id/:scheduleId', getScheduleByIds);
export default scheduleRouter;
