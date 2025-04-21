import { Optional } from 'sequelize';

export interface Schedule {
    id?: string;
    campaign: string;
    day: string;
    count: number;
    delay: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export type ScheduleCreationAttributes = Optional<Schedule, 'id'>;

export default Schedule;
