import {NextFunction, Response, Request} from "express";
import {jwtService} from "../application/jwt-service";
import {authRepository} from "../repositories/auth-repository";
import {devicesRepository} from "../repositories/devices-repository";

export const tokensMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    const verify = await jwtService.verifyToken(refreshToken)
    const black = await authRepository.findInvalidToken(refreshToken)
    const deviceId = await devicesRepository.getSessionById(verify.deviceId)

    if (!verify || black !== null || !deviceId) {
        return res.sendStatus(401)
    } else {
        next()
        return
    }
}