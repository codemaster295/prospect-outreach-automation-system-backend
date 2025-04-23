import { Request, Response } from 'express';
import { getScheduleById, getSchedulesByCampaignId, updateSchedulesByCampaignId } from './schedules.services';

export const getSchedules = async (req: Request, res: Response) => {
    const { id } = req.params;
    const schedules = await getSchedulesByCampaignId(id);
    res.status(200).json(schedules);
};
export const updateSchedules = async (req: Request, res: Response) => {
    const { id: campaignId } = req.params;
    const schedules = req.body;
  
    try {
      const updatedSchedules = await updateSchedulesByCampaignId(campaignId, schedules);
      res.status(200).json(updatedSchedules);
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Error updating schedules' });
    }
  };

  export const getScheduleByIds = async (req: Request, res: Response) => {
    try {
      const { scheduleId } = req.params;
  
      const schedule = await getScheduleById(scheduleId);
      res.status(200).json(schedule);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Failed to fetch schedule' });
    }
  };
