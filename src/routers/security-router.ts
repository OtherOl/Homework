import {Router, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {devicesRepository} from "../repositories/devices-db-repositoty";
import {tokensMiddleware} from "../middlewares/tokens-middleware";

export const securityRouter = Router({})

securityRouter.get('/devices',
    tokensMiddleware,
    async (req: Request, res: Response) => {
    const verify = await jwtService.verifyToken(req.cookies.refreshToken)
    const sessions = await devicesRepository.getAllSessions(verify.deviceId)
    res.status(200).send(sessions)
})

securityRouter.delete('/devices',
    tokensMiddleware,
    async (req: Request, res: Response) => {
    const verify = await jwtService.verifyToken(req.cookies.refreshToken)
    await devicesRepository.deleteSessions(verify.deviceId)
    res.sendStatus(204)
})

securityRouter.delete('/devices/:deviceId',
    tokensMiddleware,
    async (req: Request, res: Response) => {
    const reqId = req.params.deviceId;
    const verify = await jwtService.verifyToken(req.cookies.refreshToken)

    if (reqId !== verify.deviceId) return res.sendStatus(403)
    const deletedSession = await devicesRepository.deleteSessionById(reqId)
    if(!deletedSession) return res.sendStatus(404)
    res.sendStatus(204)
})