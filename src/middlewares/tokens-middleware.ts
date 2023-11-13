import {NextFunction, Response, Request} from "express";
import {jwtService} from "../application/jwt-service";
import {authRepository} from "../repositories/auth-db-repository";
import {devicesRepository} from "../repositories/devices-db-repositoty";

export const tokensMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    const verify = await jwtService.verifyToken(refreshToken)
    console.log('refToken in tokensmidl: ', refreshToken)
    console.log('UserId in tokensmidl: ', verify.userId)
    console.log('DeviceId in tokensmidl: ', verify.deviceId)
    const black = await authRepository.findInvalidToken(refreshToken)
    const deviceId = await devicesRepository.getSessionById(verify.deviceId)
    console.log('deviceId: ', deviceId)

    if (!verify || black !== null || !deviceId) {
        return res.sendStatus(401)
    } else {
        next()
        return
    }
}