import {Router, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {devicesRepository} from "../repositories/devices-db-repositoty";
import {tokensMiddleware} from "../middlewares/tokens-middleware";
import {authRepository} from "../repositories/auth-db-repository";

export const securityRouter = Router({})

securityRouter.get('/devices',
    tokensMiddleware,
    async (req: Request, res: Response) => {
    const verify = await jwtService.verifyToken(req.cookies.refreshToken)
    const sessions = await devicesRepository.getAllSessions(verify.userId)
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
    const verify = await jwtService.verifyToken(req.cookies.refreshToken);
    const input = await devicesRepository.getSessionById(reqId);

    if(!input || !reqId) return res.sendStatus(404)
    if (input.userId !== verify.userId) return res.sendStatus(403);

    await authRepository.blackList(req.cookies.refreshToken)
    await devicesRepository.deleteSessionById(reqId);
    res.sendStatus(204)
})