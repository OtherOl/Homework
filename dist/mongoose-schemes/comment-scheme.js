"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentScheme = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.commentScheme = new mongoose_1.default.Schema({
    postId: String,
    id: String,
    content: { type: String, required: true },
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    createdAt: String,
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String,
        likesList: []
    }
}, { versionKey: false });
