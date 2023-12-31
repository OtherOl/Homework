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
exports.tokensMiddleware = void 0;
const jwt_service_1 = require("../application/jwt-service");
const auth_repository_1 = require("../repositories/auth-repository");
const devices_repository_1 = require("../repositories/devices-repository");
const tokensMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const verify = yield jwt_service_1.jwtService.verifyToken(refreshToken);
    const black = yield auth_repository_1.authRepository.findInvalidToken(refreshToken);
    const deviceId = yield devices_repository_1.devicesRepository.getSessionById(verify.deviceId);
    if (!verify || black !== null || !deviceId) {
        return res.sendStatus(401);
    }
    else {
        next();
        return;
    }
});
exports.tokensMiddleware = tokensMiddleware;
