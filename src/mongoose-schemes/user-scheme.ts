import mongoose from "mongoose";
import {createNewUserModel} from "../models/user-model";

export const userScheme = new mongoose.Schema<createNewUserModel>({
    id: String,
    login: {type: String, required: true},
    email: {type: String, required: true},
    passwordHash: String,
    passwordSalt: String,
    createdAt: String,
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date
    },
    isConfirmed: Boolean
})