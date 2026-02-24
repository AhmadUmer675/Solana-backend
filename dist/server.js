"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const Token_1 = require("./models/Token");
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
async function start() {
    const dbOk = await (0, db_1.testDbConnection)();
    if (!dbOk) {
        console.error('Exiting: database connection failed.');
        process.exit(1);
    }
    await Token_1.Token.sync({ alter: process.env.NODE_ENV !== 'production' });
    app_1.default.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}
start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map