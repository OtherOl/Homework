"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postScheme = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.postScheme = new mongoose_1.default.Schema({
    id: String,
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: String,
    blogName: String,
    createdAt: String
}, { versionKey: false });
