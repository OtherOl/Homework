"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityRouter = void 0;
const express_1 = require("express");
const jwt_service_1 = require("../application/jwt-service");
const devices_db_repositoty_1 = require("../repositories/devices-db-repositoty");
const tokens_middleware_1 = require("../middlewares/tokens-middleware");
exports.securityRouter = (0, express_1.Router)({});
exports.securityRouter.get('/devices', tokens_middleware_1.tokensMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verify = yield jwt_service_1.jwtService.verifyToken(req.cookies.refreshToken);
    const sessions = yield devices_db_repositoty_1.devicesRepository.getAllSessions(verify.deviceId);
    res.status(200).send(sessions);
}));
exports.securityRouter.delete('/devices', tokens_middleware_1.tokensMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verify = yield jwt_service_1.jwtService.verifyToken(req.cookies.refreshToken);
    yield devices_db_repositoty_1.devicesRepository.deleteSessions(verify.deviceId);
    res.sendStatus(204);
}));
exports.securityRouter.delete('/devices/:deviceId', tokens_middleware_1.tokensMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqId = req.params.deviceId;
    const verify = yield jwt_service_1.jwtService.verifyToken(req.cookies.refreshToken);
    if (reqId !== verify.deviceId)
        return res.sendStatus(403);
    const deletedSession = yield devices_db_repositoty_1.devicesRepository.deleteSessionById(reqId);
    if (!deletedSession)
        return res.sendStatus(404);
    res.sendStatus(204);
}));
