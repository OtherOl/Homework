"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.SecurityController = void 0;
const devices_repository_1 = require("../repositories/devices-repository");
const jwt_service_1 = require("../application/jwt-service");
const inversify_1 = require("inversify");
let SecurityController = class SecurityController {
    constructor(devicesRepository) {
        this.devicesRepository = devicesRepository;
    }
    getAllSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const verify = yield jwt_service_1.jwtService.verifyToken(req.cookies.refreshToken);
            const sessions = yield this.devicesRepository.getAllSessions(verify.userId);
            res.status(200).send(sessions);
        });
    }
    deleteSessionsExceptOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const verify = yield jwt_service_1.jwtService.verifyToken(req.cookies.refreshToken);
            yield this.devicesRepository.deleteSessions(verify.deviceId);
            res.sendStatus(204);
        });
    }
    deleteSessionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqId = req.params.deviceId;
            const verify = yield jwt_service_1.jwtService.verifyToken(req.cookies.refreshToken);
            const input = yield this.devicesRepository.getSessionById(reqId);
            if (!input || !reqId)
                return res.sendStatus(404);
            if (input.userId !== verify.userId)
                return res.sendStatus(403);
            yield this.devicesRepository.deleteSessionById(reqId);
            res.sendStatus(204);
        });
    }
};
exports.SecurityController = SecurityController;
exports.SecurityController = SecurityController = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [devices_repository_1.DevicesRepository])
], SecurityController);
