import jwt from 'jsonwebtoken'
import {userModel} from "../models/user-model";
import {settings} from "../settings";
import {ObjectId} from "mongodb";

export const jwtService = {
    async createJWT(
        user: userModel
    ) {
        const token = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: "1h"})
        return {
            accessToken: token
        }
    },

    async getUserIdByToken(
        token: string
    ) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    },

    async getUserByToken(
        token: string
    ) {
        try {
            const user: any = jwt.sign(token, settings.JWT_SECRET)
            return {
                email: user.email,
                login: user.login,
                userId: user.id
            }
        } catch (error) {
            return false
        }
    },
}