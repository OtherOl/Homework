import {Response, Router, Request} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {bodyAuthValidation} from "../middlewares/body-auth-validation";
import {authMiddleware} from "../middlewares/auth-middleware";
import {bodyUserValidation} from "../middlewares/body-user-validation";

export const authRouter = Router({})

authRouter.post('/login',
    bodyAuthValidation.loginOrEmail, bodyAuthValidation.password,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (!user) {
            res.sendStatus(401)
        } else {
            const token = await jwtService.createJWT(user)
            res.status(200).send(token)
        }
    })

authRouter.post('/registration',
    bodyUserValidation.login, bodyUserValidation.email,
    bodyUserValidation.password, inputValidationMiddleware,
    async (req: Request, res: Response) => {
    const newUser = await usersService.createUser(req.body.login, req.body.email, req.body.password)
    res.sendStatus(204)
})

authRouter.get('/me',
    authMiddleware,
    async (req: Request, res: Response) => {
        const user = req.user;

        return {
            email: user!.email,
            login: user!.login,
            userId: user!.id
        }
    })
