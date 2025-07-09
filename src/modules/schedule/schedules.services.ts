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

export const updateSchedulesByCampaignId = async (
    campaignId: string,
    newSchedules: Schedule[],
  ) => {
    if (!validateSchedule(newSchedules)) {
      throw new Error('Invalid schedules schema');
    }
  

    const updatedSchedules: Schedule[] = [];
  
    for (const schedule of newSchedules) {

      const existingSchedule = await Schedules.findOne({
        where: { campaign: campaignId, id: schedule.id },
      });
  
      if (existingSchedule) {

        await Schedules.update(
          {
            count: schedule.count,
            delay: schedule.delay,
          },
          {
            where: { campaign: campaignId, id: schedule.id },
          }
        );
        updatedSchedules.push({ ...existingSchedule, ...schedule });
      } else {

        const newSchedule = await Schedules.create({
          ...schedule,
          campaign: campaignId,
        });
        updatedSchedules.push(newSchedule);
      }
    }
  
    return updatedSchedules;
  };
  export const getScheduleById = async (scheduleId: string) => {
    const schedule = await Schedules.findOne({
        where: { id: scheduleId }
    }); 
    return schedule;
  };
