"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentScheme = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.commentScheme = new mongoose_1.default.Schema({
    id: String,
    content: { type: String, required: true },
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    createdAt: String
});
