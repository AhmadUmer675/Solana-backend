"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallet_controller_1 = require("../auth/wallet.controller");
const tokenController = __importStar(require("./token.controller"));
const router = (0, express_1.Router)();
/**
 * POST /api/token/fee-transaction
 * Body: { wallet: string } — Phantom wallet public key
 * Returns: { success, serializedTransaction, lastValidBlockHeight }
 */
router.post('/fee-transaction', wallet_controller_1.validatePublicKey, tokenController.feeTransaction);
/**
 * POST /api/token/create
 * Body: {
 *   wallet: string,
 *   tokenName: string,
 *   symbol: string,
 *   supply: string | number,
 *   feeTxSignature: string,
 *   mintPublicKey: string
 * }
 * Returns: { success, serializedTransaction, lastValidBlockHeight, mintAddress, tokenId }
 */
router.post('/create', wallet_controller_1.validatePublicKey, tokenController.createToken);
exports.default = router;
//# sourceMappingURL=token.routes.js.map