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
exports.devicesRepository = void 0;
const DB_Mongo_1 = require("../data/DB-Mongo");
exports.devicesRepository = {
    addSession(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_Mongo_1.DeviceModelClass.create(Object.assign({}, inputData));
        });
    },
    getAllSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield DB_Mongo_1.DeviceModelClass.find({ userId: userId }, { _id: 0, userId: 0 }).lean();
            return session;
        });
    },
    getSessionById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.DeviceModelClass.findOne({ deviceId: deviceId });
        });
    },
    deleteSessions(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.DeviceModelClass.deleteMany({ deviceId: { $ne: deviceId } });
        });
    },
    deleteSessionById(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleted = yield DB_Mongo_1.DeviceModelClass.deleteOne({ deviceId: deviceId });
            return deleted.deletedCount === 1;
        });
    },
    updateSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.DeviceModelClass.findOneAndUpdate({ deviceId: id }, { $set: { lastActiveDate: new Date().toISOString() } });
        });
    },
};
