"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.testDbConnection = testDbConnection;
const sequelize_1 = require("sequelize");
/**
 * PostgreSQL + Sequelize configuration.
 * Uses separate environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
 */
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
if (!dbHost) {
    throw new Error('DB_HOST environment variable is required');
}
if (!dbUser) {
    throw new Error('DB_USER environment variable is required');
}
if (!dbPassword) {
    throw new Error('DB_PASSWORD environment variable is required');
}
if (!dbName) {
    throw new Error('DB_NAME environment variable is required');
}
exports.sequelize = new sequelize_1.Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    define: {
        timestamps: true,
        underscored: true,
    },
});
/**
 * Test database connectivity.
 */
async function testDbConnection() {
    try {
        await exports.sequelize.authenticate();
        return true;
    }
    catch (err) {
        console.error('Database connection failed:', err);
        return false;
    }
}
//# sourceMappingURL=db.js.map