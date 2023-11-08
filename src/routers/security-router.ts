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

securityRouter.delete('/devices', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const verify = await jwtService.verifyToken(refreshToken)
    const black = await authRepository.findInvalidToken(refreshToken)

    if (!verify || black !== null) return res.sendStatus(401)
    await devicesRepository.deleteSessions(verify.deviceId)
    res.sendStatus(204)
})

securityRouter.delete('/devices/:deviceId', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const verify = await jwtService.verifyToken(refreshToken)
    const black = await authRepository.findInvalidToken(refreshToken)
    const reqId = req.params.deviceId

    if (!verify || black !== null) return res.sendStatus(401)
    if (reqId !== verify.deviceId) return res.sendStatus(403)
    const deletedSession = await devicesRepository.deleteSessionById(reqId)
    return deletedSession ? res.sendStatus(204) : res.sendStatus(404)
})