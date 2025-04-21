import { DB } from '@/database';
import Schedule from '@/interfaces/schedule';
const { Schedules } = DB;

export const createScheduleBulk = async (schedules: Schedule[]) => {
    if (!validateSchedule(schedules)) {
        throw new Error('Invalid schedules schema');
    }
    const schedule = await Schedules.bulkCreate(schedules);
    return schedule;
};

export const validateSchedule = (schedules: Schedule[]) => {
    return schedules.every(
        schedule => schedule.day && schedule.count && schedule.delay,
    );
};

export const getSchedulesByCampaignId = async (campaignId: string) => {
    const schedules = await Schedules.findAll({
        where: { campaign: campaignId },
    });
    return schedules;
};
