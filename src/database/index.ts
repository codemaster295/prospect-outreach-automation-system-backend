import logger from '@/utils/logger';
import Sequelize from 'sequelize';
import FileModel from './models/files.model';
import ContactsModel from './models/contacts.model';
import TemplateModel from './models/template.model';
import VariablesModel from './models/variables.model';
import ContactFileModel from './models/contactFiles.model';
import campaignsModel from './models/campaigns.model';
import MailboxModel from './models/mailboxes.model';
import {
    DB_DIALECT,
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
    DB_PORT,
} from '@/config';
import MailboxConfigModel from './models/mailboxconfig.model';
import SentEmailModel from './models/sentemail.model';
import ScheduleModel from './models/schedule.model';
import AnalyticsModel from './models/analytics.model';
const sequelize = new Sequelize.Sequelize(
    DB_DATABASE || 'prospect-db',
    DB_USERNAME || 'root',
    DB_PASSWORD || 'password123',
    {
        host: DB_HOST || 'localhost',
        dialect: DB_DIALECT as Sequelize.Dialect,
        port: parseInt(DB_PORT || '3306'),
        logging: (query: string, time: number | undefined) => {
            logger.info(time + 'ms' + ' ' + query);
        },
    },
);
sequelize.authenticate();

console.log(sequelize.getDialect());
const DB = {
    Contacts: ContactsModel(sequelize),
    ContactFiles: ContactFileModel(sequelize),
    Files: FileModel(sequelize),
    Templates: TemplateModel(sequelize),
    Campaigns: campaignsModel(sequelize),
    Variables: VariablesModel(sequelize),
    Mailbox: MailboxModel(sequelize),
    MailboxConfig: MailboxConfigModel(sequelize),
    SentEmail: SentEmailModel(sequelize),
    Analytics: AnalyticsModel(sequelize),
    Schedules: ScheduleModel(sequelize),
    sequelize, // connection instance (RAW queries)
    Sequelize, // library
};

DB.Campaigns.associate(DB);
DB.Mailbox.associate(DB);
DB.SentEmail.associate(DB);
DB.Schedules.associate(DB);
DB.Contacts.associate(DB);
DB.Analytics.associate(DB);

export { DB };
