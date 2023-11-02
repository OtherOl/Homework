import {Response, Router, Request} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {bodyAuthValidation} from "../middlewares/body-auth-validation";
import {authMiddleware} from "../middlewares/auth-middleware";
import {bodyUserValidation} from "../middlewares/body-user-validation";
import {authRepository} from "../repositories/auth-db-repository";

export const authRouter = Router({})

authRouter.post('/login',
    bodyAuthValidation.loginOrEmail, bodyAuthValidation.password,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)

        if (!user) {
            return res.sendStatus(401)
        } else {
            const token = await jwtService.createJWT(user)
            const refreshToken = await jwtService.createRefreshToken(user)

            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            return res.status(200).send({"accessToken": token})
        }
    })

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const verify = await jwtService.verifyToken(refreshToken)
    console.log(verify)
    if (!refreshToken || typeof refreshToken !== "string" || !verify) {
        return res.sendStatus(401)
    }

    const accessToken = await jwtService.createJWT(verify)
    const refToken = await jwtService.createRefreshToken(verify)

    const newToken = await authRepository.findInvalidToken(refToken)


    if (newToken !== null) {
        return res.sendStatus(401)
    } else {
        await authRepository.blackList(refreshToken)
        res.cookie('refreshToken', refToken, {httpOnly: true, secure: true})
        return res.status(200).send({
            "accessToken": accessToken
        })
    }
})

authRouter.post('/registration',
    bodyUserValidation.login, bodyUserValidation.email,
    bodyUserValidation.password, inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newUser = await usersService.createUserForRegistration(req.body.login, req.body.email, req.body.password);
        if (newUser === "email exists") {
            return res.status(400).send({
                errorsMessages: [
                    {
                        message: "User with current email already exists",
                        field: "email"
                    }
                ]
            })
        } else if (newUser === "login exists") {
            return res.status(400).send({
                errorsMessages: [
                    {
                        message: "User with current login already exists",
                        field: "login"
                    }
                ]
            })
        }

        res.sendStatus(204)
    })

authRouter.post('/registration-confirmation', async (req: Request, res: Response) => {
    const confirmedUser = await usersService.confirmEmail(req.body.code)

    if (!confirmedUser) {
        return res.status(400).send({
            errorsMessages: [
                {
                    message: "Incorrect code",
                    field: "code"
                }
            ]
        })
    } else {
        return res.sendStatus(204)
    }
})

authRouter.post('/registration-email-resending',
    bodyUserValidation.email, inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const confirmedUser = await usersService.resendConfirmation(req.body.email);

        if (confirmedUser === "User doesn't exists") {
            return res.status(400).send({
                errorsMessages: [
                    {
                        message: "User with current email doesn't exists",
                        field: "email"
                    }
                ]
            })
        } else if (confirmedUser === "User already confirmed") {
            return res.status(400).send({
                errorsMessages: [
                    {
                        message: "User with current email already confirmed",
                        field: "email"
                    }
                ]
            })
        }

        res.sendStatus(204)
    })

authRouter.get('/me',
    authMiddleware,
    async (req: Request, res: Response) => {
        const user = req.user;
        let currUser = {
            email: user!.email,
            login: user!.login,
            userId: user!.id
        }

        res.status(200).send(currUser)
    })

authRouter.post('/logout', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const result = await jwtService.verifyToken(refreshToken)

    if (!refreshToken || typeof refreshToken !== "string" || !result) {
        return res.sendStatus(401)
    } else {
        await authRepository.blackList(refreshToken)
        return res.clearCookie("refreshToken").sendStatus(204)
    }
})