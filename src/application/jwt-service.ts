import jwt from 'jsonwebtoken'
import {userModel} from "../models/user-model";
import {settings} from "../settings";

export const jwtService = {
    async createJWT(
        user: userModel
    ) {
        return jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: "1000s"})
    },

    async createRefreshToken(
        user: userModel
    ) {
        return jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: "2000s"})
    },

    async createJWTF(
        id: string
    ) {
        return jwt.sign({userId: id}, settings.JWT_SECRET, {expiresIn: "1000s"})
    },

    async createRefreshTokenF(
        id: string
    ) {
        return jwt.sign({userId: id}, settings.JWT_SECRET, {expiresIn: "2000s"})
    },

    async verifyToken(
        token: string
    ) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            console.log('JWT SERVICE: ', result)
            return result
        } catch (error) {
            return false
        }
    },

    async getUserIdByToken(
        token: string
    ) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)

            return result.userId
        } catch (error) {
            return false
        }
    },
}