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
const auth_db_repository_1 = require("../repositories/auth-db-repository");
const devices_db_repositoty_1 = require("../repositories/devices-db-repositoty");
exports.securityRouter = (0, express_1.Router)({});
exports.securityRouter.get('/devices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const verify = yield jwt_service_1.jwtService.verifyToken(refreshToken);
    const black = yield auth_db_repository_1.authRepository.findInvalidToken(refreshToken);
    if (!verify || black !== null)
        return res.sendStatus(401);
    const sessions = yield devices_db_repositoty_1.devicesRepository.getAllSessions(verify.deviceId);
    res.status(200).send(sessions);
}));
exports.securityRouter.delete('/devices', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const verify = yield jwt_service_1.jwtService.verifyToken(refreshToken);
    const black = yield auth_db_repository_1.authRepository.findInvalidToken(refreshToken);
    if (!verify || black !== null)
        return res.sendStatus(401);
    yield devices_db_repositoty_1.devicesRepository.deleteSessions(verify.deviceId);
    res.sendStatus(204);
}));
exports.securityRouter.delete('/devices/:deviceId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const verify = yield jwt_service_1.jwtService.verifyToken(refreshToken);
    const black = yield auth_db_repository_1.authRepository.findInvalidToken(refreshToken);
    const reqId = req.params.deviceId;
    if (!verify || black !== null)
        return res.sendStatus(401);
    if (reqId !== verify.deviceId)
        return res.sendStatus(403);
    const deletedSession = yield devices_db_repositoty_1.devicesRepository.deleteSessionById(reqId);
    return deletedSession ? res.sendStatus(204) : res.sendStatus(404);
}));
