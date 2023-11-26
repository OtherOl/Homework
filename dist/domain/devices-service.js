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
exports.devicesService = void 0;
const devices_db_repository_1 = require("../repositories/devices-db-repository");
const jwt_service_1 = require("../application/jwt-service");
const mongodb_1 = require("mongodb");
class DevicesService {
    createSession(ip, title = "Chrome 105", refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const verifiedToken = yield jwt_service_1.jwtService.verifyToken(refreshToken);
            const newSession = {
                _id: new mongodb_1.ObjectId(),
                ip: ip,
                title: title,
                lastActiveDate: new Date(verifiedToken.iat * 1000).toISOString(),
                deviceId: verifiedToken.deviceId,
                userId: verifiedToken.userId
            };
            yield devices_db_repository_1.devicesRepository.addSession(newSession);
            return newSession;
        });
    }
}
exports.devicesService = new DevicesService();
