import logger from '@/utils/logger';
import Sequelize from 'sequelize';
import userModel from './models/user.model';
import FileModel from './models/files.model';
import ContactsModel from './models/contacts.model';
import { DB_DIALECT, DB_STORAGE, NODE_ENV } from '@/config';
import ContactFileModel from './models/contactFiles.model';
const sequelize = new Sequelize.Sequelize({
    dialect: (DB_DIALECT as Sequelize.Dialect) || 'sqlite',
    storage: DB_STORAGE || './data/prospects_db.sqlite',
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        // underscored: true,
        freezeTableName: true,
    },
    pool: {
        min: 0,
        max: 5,
    },
    logQueryParameters: NODE_ENV === 'development',
    logging: (query, time) => {
        logger.info(time + 'ms' + ' ' + query);
    },
    benchmark: true,
});

sequelize.authenticate();
// const Contacts = ContactsModel(sequelize);
console.log(sequelize.getDialect());
// export { sequelize, Contacts };
export const DB = {
    Users: userModel(sequelize),
    Contacts: ContactsModel(sequelize),
    ContactFiles: ContactFileModel(sequelize),
    Files: FileModel(sequelize),
    sequelize, // connection instance (RAW queries)
    Sequelize, // library
};
