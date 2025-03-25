const { config } = require('dotenv');
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const { DB_DIALECT, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT } =
    process.env;

module.exports = {
    dialect: DB_DIALECT || 'mysql',
    host: DB_HOST || 'localhost',
    username: DB_USERNAME || 'root',
    password: DB_PASSWORD || 'password123',
    database: DB_DATABASE || 'prospect-db',
    port: DB_PORT || '3306',
    migrationStorageTableName: 'sequelize_migrations',
    seederStorageTableName: 'sequelize_seeds',
    seederStorage: 'sequelize',
    seederStoragePath: 'sequelize',
};
