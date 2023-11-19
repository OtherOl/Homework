import {Types} from "mongoose";
import {ObjectId} from "mongodb";

export type userModel = {
    id: string,
    login: string,
    email: string,
    passwordHash: string;
    createdAt: string
}

export type createNewUserModel = {
    _id: ObjectId
    id: string,
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: string,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: any
    },
    isConfirmed: boolean
}

export type userViewModel = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

