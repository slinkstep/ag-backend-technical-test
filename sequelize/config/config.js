require('dotenv').config({ path: __dirname + '/../../.env' });


const commonConfig = {
    dialect: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'database',
    logging: console.log,
};

module.exports = {
    development: {
        ...commonConfig,
    },
    production: {
        ...commonConfig,
        logging: false,
    },
};
