import {NextFunction, Response, Request} from "express";
import {jwtService} from "../application/jwt-service";
import {authRepository} from "../repositories/auth-db-repository";

export const tokensMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    const verify = await jwtService.verifyToken(refreshToken)
    const black = await authRepository.findInvalidToken(refreshToken)

    if (!verify || black !== null) {
        return res.sendStatus(401)
    } else {
        next()
        return
    }
}