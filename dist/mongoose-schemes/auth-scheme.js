"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authScheme = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.authScheme = new mongoose_1.default.Schema({
    token: String
}, { versionKey: false });
