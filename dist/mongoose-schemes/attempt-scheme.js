"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attemptScheme = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.attemptScheme = new mongoose_1.default.Schema({
    IP: String,
    URL: String,
    date: Date
}, { versionKey: false });
