const { config } = require('dotenv');
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const { DB_DIALECT, DB_STORAGE } = process.env;

module.exports = {
    dialect: DB_DIALECT || 'sqlite',
    storage: DB_STORAGE || './data/prospects_db.sqlite',
    migrationStorageTableName: 'sequelize_migrations',
    seederStorageTableName: 'sequelize_seeds',
};
