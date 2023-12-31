import {NextFunction, Response, Request} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }

    const token = req.headers.authorization.split(" ")[1]

    const userId = await jwtService.getUserIdByToken(token)

    if (userId) {
        req.user = await usersService.findUserById(userId)
        next()
        return
    } else {
        return res.sendStatus(401)
    }


}