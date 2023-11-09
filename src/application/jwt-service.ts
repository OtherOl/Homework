import jwt from 'jsonwebtoken'
import {settings} from "../settings";
import {randomUUID} from "crypto";

export const jwtService = {
    async createJWT(
        id: string
    ) {
        return jwt.sign({userId: id}, settings.JWT_SECRET, {expiresIn: "10s"})
    },

    async createRefreshToken(
        id: string
    ) {
        return jwt.sign({userId: id, deviceId: randomUUID()}, settings.JWT_SECRET, {expiresIn: "20s"})
    },

    async verifyToken(
        token: string
    ) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
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