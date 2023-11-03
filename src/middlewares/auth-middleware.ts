import {NextFunction, Response, Request} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // const accessToken = req.headers.authorization
    const refreshToken = req.cookies.refreshToken
    // if (!req.headers.authorization) {
    //     return res.sendStatus(401)
    // }
    // if(!accessToken || !refreshToken) {
    //     return res.sendStatus(401)
    // }

    // const token = req.headers.authorization.split(" ")[1]

    const userId = await jwtService.getUserIdByToken(refreshToken)
    // console.log(token)
    // console.log(userId)

    if (userId) {
        req.user = await usersService.findUserById(userId)
        next()
        return
    } else {
        return res.sendStatus(401)
    }


}