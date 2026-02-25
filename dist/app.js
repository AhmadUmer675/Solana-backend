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
const solana_1 = require("./config/solana");
const app = (0, express_1.default)();
const allowedOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
app.use(allowedOrigins.length
    ? (0, cors_1.default)({ origin: allowedOrigins, credentials: true })
    : (0, cors_1.default)());
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
app.get('/health/solana', async (_req, res) => {
    try {
        const epochInfo = await solana_1.solanaConnection.getEpochInfo('confirmed');
        const balance = await solana_1.solanaConnection.getBalance(solana_1.PLATFORM_WALLET_PUBKEY, 'confirmed');
        res.status(200).json({
            status: 'ok',
            rpc: solana_1.SOLANA_RPC_URL,
            epoch: epochInfo.epoch,
            balanceLamports: balance,
        });
    }
    catch (err) {
        res.status(502).json({
            status: 'error',
            rpc: solana_1.SOLANA_RPC_URL,
            error: err instanceof Error ? err.message : 'RPC error',
        });
    }
});
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