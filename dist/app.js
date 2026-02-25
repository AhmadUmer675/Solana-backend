"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const token_routes_1 = __importDefault(require("./modules/token/token.routes"));
const wallet_routes_1 = __importDefault(require("./modules/auth/wallet.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '64kb' }));
// API Info endpoint
app.get('/api', (_req, res) => {
    res.status(200).json({
        success: true,
        service: 'Solana Token Launcher API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /health',
            wallet: {
                connect: 'POST /api/wallet/connect',
                description: 'Connect and validate Phantom wallet',
                body: { wallet: 'string (Phantom wallet public key)' }
            },
            token: {
                feeTransaction: 'POST /api/token/fee-transaction',
                description: 'Get unsigned 0.10 SOL fee transaction',
                body: { wallet: 'string (Phantom wallet public key)' },
                create: 'POST /api/token/create',
            }
        },
        documentation: 'See README.md or API.md for detailed documentation'
    });
});
app.use('/api/wallet', wallet_routes_1.default);
app.use('/api/token', token_routes_1.default);
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'solana-token-launcher' });
});
app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Not found' });
});
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});
exports.default = app;
//# sourceMappingURL=app.js.map