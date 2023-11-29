"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likesScheme = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
exports.likesScheme = new mongoose_1.default.Schema({
    _id: mongodb_1.ObjectId,
    type: String,
    userId: String,
    commentId: String,
});
