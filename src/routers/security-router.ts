import {Router, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {DevicesRepository} from "../repositories/devices-db-repository";
import {tokensMiddleware} from "../middlewares/tokens-middleware";

export const securityRouter = Router({})

class SecurityController {
    devicesRepository: DevicesRepository
    constructor() {
        this.devicesRepository = new DevicesRepository()
    }
    async getAllSessions(req: Request, res: Response) {
        const verify = await jwtService.verifyToken(req.cookies.refreshToken);
        const sessions = await this.devicesRepository.getAllSessions(verify.userId)
        res.status(200).send(sessions)
    }

    async deleteSessionsExceptOne(req: Request, res: Response) {
        const verify = await jwtService.verifyToken(req.cookies.refreshToken)
        await this.devicesRepository.deleteSessions(verify.deviceId)
        res.sendStatus(204)
    }

    async deleteSessionById(req: Request, res: Response) {
        const reqId = req.params.deviceId;
        const verify = await jwtService.verifyToken(req.cookies.refreshToken);
        const input = await this.devicesRepository.getSessionById(reqId);

        if (!input || !reqId) return res.sendStatus(404)
        if (input.userId !== verify.userId) return res.sendStatus(403);

        await this.devicesRepository.deleteSessionById(reqId);
        res.sendStatus(204)
    }
}

const securityControllerInstance = new SecurityController()

securityRouter.get('/devices',
    tokensMiddleware,
    securityControllerInstance.getAllSessions.bind(securityControllerInstance))

securityRouter.delete('/devices',
    tokensMiddleware,
    securityControllerInstance.deleteSessionsExceptOne.bind(securityControllerInstance))

securityRouter.delete('/devices/:deviceId',
    tokensMiddleware,
    securityControllerInstance.deleteSessionById.bind(securityControllerInstance))