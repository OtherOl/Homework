import {NextFunction, Response, Request} from "express";
import {attemptsRepository} from "../repositories/attempts-db-repository";

export const attemptsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip
    const url = req.baseUrl
    const date = new Date()
    const attempts = await attemptsRepository.getAttemptsByIp(ip, url, date)

    if (attempts > 5) {
        return res.sendStatus(429)
    } else {
        next()
    }
}