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
const upload_routes_1 = __importDefault(require("./modules/upload/upload.routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const corsOrigin = process.env.CORS_ORIGIN;
app.use((0, cors_1.default)(corsOrigin
    ? { origin: corsOrigin.split(',').map((o) => o.trim()), credentials: false }
    : undefined));
app.use(express_1.default.json({ limit: '64kb' }));
app.use('/uploads', express_1.default.static(path_1.default.resolve(process.cwd(), 'uploads')));
// API Info endpoint
app.get('/api', (_req, res) => {
    res.status(200).json({
        success: true,
        service: 'Solana Token Launcher API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /health',
            wallet: {
                connect: {
                    path: 'POST /api/wallet/connect',
                    description: 'Connect and validate Phantom wallet',
                    body: { wallet: 'string (Phantom wallet public key)' }
                },
                verify: {
                    path: 'POST /api/wallet/verify',
                    description: 'Verify signed message (stubbed)',
                    body: { message: 'string', signature: 'string', wallet: 'string' }
                },
                disconnect: {
                    path: 'POST /api/wallet/disconnect',
                    description: 'Disconnect wallet (no-op)',
                }
            },
            token: {
                feeTransaction: {
                    path: 'POST /api/token/fee-transaction',
                    description: 'Get unsigned 0.10 SOL fee transaction',
                    body: { wallet: 'string (Phantom wallet public key)' }
                },
                create: {
                    path: 'POST /api/token/create',
                    description: 'Create SPL token (after fee is paid)',
                    body: {
                        wallet: 'string',
                        tokenName: 'string',
                        symbol: 'string',
                        supply: 'number | string',
                        feeTxSignature: 'string',
                        mintPublicKey: 'string'
                    }
                }
            }
        },
        documentation: 'See README.md or API.md for detailed documentation'
    });
});
app.use('/api/wallet', wallet_routes_1.default);
app.use('/api/token', token_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
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