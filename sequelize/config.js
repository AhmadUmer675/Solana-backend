'use strict';

require('dotenv').config();

/**
 * Sequelize CLI config. Uses separate DB environment variables.
 */
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'solana_token_launcher',
  dialect: 'postgres',
};

module.exports = {
  development: {
    ...dbConfig,
    logging: console.log,
  },
  test: {
    ...dbConfig,
    logging: false,
  },
  production: {
    ...dbConfig,
    logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
  },
};
