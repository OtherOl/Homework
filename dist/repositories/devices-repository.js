"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.devicesRepository = exports.DevicesRepository = void 0;
const DB_Mongo_1 = require("../data/DB-Mongo");
const inversify_1 = require("inversify");
let DevicesRepository = class DevicesRepository {
    addSession(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_Mongo_1.DeviceModelClass.create(Object.assign({}, inputData));
        });
    }
    getAllSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield DB_Mongo_1.DeviceModelClass.find({ userId: userId }, { _id: 0, userId: 0 }).lean();
            return session;
        });
    }
    getSessionById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.DeviceModelClass.findOne({ deviceId: deviceId });
        });
    }
    deleteSessions(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.DeviceModelClass.deleteMany({ deviceId: { $ne: deviceId } });
        });
    }
    deleteSessionById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield DB_Mongo_1.DeviceModelClass.deleteOne({ deviceId: deviceId });
            return deleted.deletedCount === 1;
        });
    }
    updateSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.DeviceModelClass.findOneAndUpdate({ deviceId: id }, { $set: { lastActiveDate: new Date().toISOString() } });
        });
    }
};
exports.DevicesRepository = DevicesRepository;
exports.DevicesRepository = DevicesRepository = __decorate([
    (0, inversify_1.injectable)()
], DevicesRepository);
exports.devicesRepository = new DevicesRepository(); // only for middlewares
