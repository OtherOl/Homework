import {Response, Router, Request} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";

export const authRouter = Router({})

authRouter.post('/login', async (req: Request, res: Response) => {
    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

    if (!user) {
        return res.sendStatus(401)
    } else {
        const token = await jwtService.createJWT(user)
        return res.status(200).send(token)
    }
})
