"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceScheme = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.deviceScheme = new mongoose_1.default.Schema({
    _id: { type: String, select: false },
    ip: String,
    title: String,
    lastActiveDate: Date,
    deviceId: String,
    userId: { type: String, select: false }
}, { versionKey: false });
