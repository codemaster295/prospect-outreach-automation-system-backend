import { DB } from '@/database';
import { Analytics } from '@/interfaces/analytics.interfaces';
import { FindOptions } from 'sequelize';
const AnalyticsModel = DB.Analytics;
export const recordAnalytics = async (data: Analytics) => {
    return await AnalyticsModel.create(data);
};

export const getAnalytics = async (query: FindOptions) => {
    return await AnalyticsModel.findOne(query);
};
