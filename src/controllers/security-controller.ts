import {DevicesRepository} from "../repositories/devices-repository";
import {Request, Response} from "express";
import {jwtService} from "../application/jwt-service";

export class SecurityController {
    constructor(protected devicesRepository: DevicesRepository) {
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