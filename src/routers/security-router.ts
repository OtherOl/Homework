import {Router, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {authRepository} from "../repositories/auth-db-repository";
import {devicesRepository} from "../repositories/devices-db-repositoty";

export const securityRouter = Router({})

securityRouter.get('/devices', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const verify = await jwtService.verifyToken(refreshToken)
    const black = await authRepository.findInvalidToken(refreshToken)

    if (!verify || black !== null) return res.sendStatus(401)
    const sessions = await devicesRepository.getAllSessions(verify.deviceId)
    res.status(200).send(sessions)
})