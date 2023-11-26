import {Router, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {devicesRepository} from "../repositories/devices-db-repository";
import {tokensMiddleware} from "../middlewares/tokens-middleware";

export const securityRouter = Router({})

class SecurityController {
    async getAllSessions(req: Request, res: Response) {
        const verify = await jwtService.verifyToken(req.cookies.refreshToken);
        const sessions = await devicesRepository.getAllSessions(verify.userId)
        res.status(200).send(sessions)
    }

    async deleteSessionsExceptOne(req: Request, res: Response) {
        const verify = await jwtService.verifyToken(req.cookies.refreshToken)
        await devicesRepository.deleteSessions(verify.deviceId)
        res.sendStatus(204)
    }

    async deleteSessionById(req: Request, res: Response) {
        const reqId = req.params.deviceId;
        const verify = await jwtService.verifyToken(req.cookies.refreshToken);
        const input = await devicesRepository.getSessionById(reqId);

        if (!input || !reqId) return res.sendStatus(404)
        if (input.userId !== verify.userId) return res.sendStatus(403);

        await devicesRepository.deleteSessionById(reqId);
        res.sendStatus(204)
    }
}

const securityControllerInstance = new SecurityController()

securityRouter.get('/devices',
    tokensMiddleware,
    securityControllerInstance.getAllSessions)

securityRouter.delete('/devices',
    tokensMiddleware,
    securityControllerInstance.deleteSessionsExceptOne)

securityRouter.delete('/devices/:deviceId',
    tokensMiddleware,
    securityControllerInstance.deleteSessionById)