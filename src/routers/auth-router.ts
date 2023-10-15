import {Response, Router, Request} from "express";
import {usersService} from "../domain/users-service";

export const authRouter = Router({})

authRouter.post('/login', async (req: Request, res: Response) => {
    const login = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

    if (!login) {
        return res.sendStatus(401)
    }
    return res.sendStatus(204)
})