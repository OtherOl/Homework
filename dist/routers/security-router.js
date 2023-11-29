"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityRouter = void 0;
const express_1 = require("express");
const tokens_middleware_1 = require("../middlewares/tokens-middleware");
const compostion_root_1 = require("../compostion-root");
exports.securityRouter = (0, express_1.Router)({});
exports.securityRouter.get('/devices', tokens_middleware_1.tokensMiddleware, compostion_root_1.securityController.getAllSessions.bind(compostion_root_1.securityController));
exports.securityRouter.delete('/devices', tokens_middleware_1.tokensMiddleware, compostion_root_1.securityController.deleteSessionsExceptOne.bind(compostion_root_1.securityController));
exports.securityRouter.delete('/devices/:deviceId', tokens_middleware_1.tokensMiddleware, compostion_root_1.securityController.deleteSessionById.bind(compostion_root_1.securityController));
