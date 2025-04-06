import { DB } from '@database/index';
import { FindOptions } from 'sequelize';

const SentEmail = DB.SentEmail;

export const getSentEmail = async (query: FindOptions) => {
    return await SentEmail.findOne(query);
};
