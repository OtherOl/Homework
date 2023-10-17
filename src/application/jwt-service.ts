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
            console.log(token)
            const result: any = jwt.verify(token, settings.JWT_SECRET)

            // console.log(result)
            return result.userId
        } catch (error) {
            return false
        }
    }
}