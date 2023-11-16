"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userScheme = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.userScheme = new mongoose_1.default.Schema({
    id: String,
    login: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: String,
    passwordSalt: String,
    createdAt: String,
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date
    },
    isConfirmed: Boolean
});
