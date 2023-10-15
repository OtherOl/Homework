import jwt from 'jsonwebtoken'
import {userModel} from "../models/user-model";
import {settings} from "../settings";

export const jwtService = {
    async createJWT(
        user: userModel
    ) {
        const token = jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: "1h"})
        return {
            accessToken: token
        }
    }
}