import { Request, Response } from 'express';
import { getSchedulesByCampaignId } from './schedules.services';

export const getSchedules = async (req: Request, res: Response) => {
    const { id } = req.params;
    const schedules = await getSchedulesByCampaignId(id);
    res.status(200).json(schedules);
};
