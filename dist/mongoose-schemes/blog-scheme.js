"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogScheme = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.blogScheme = new mongoose_1.default.Schema({
    id: String,
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: String,
    isMembership: Boolean
}, { versionKey: false });
