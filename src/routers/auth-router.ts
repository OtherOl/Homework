import {Response, Router, Request} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {bodyAuthValidation} from "../middlewares/body-auth-validation";
import {authMiddleware} from "../middlewares/auth-middleware";
import {bodyUserValidation} from "../middlewares/body-user-validation";
import {authRepository} from "../repositories/auth-db-repository";
import {devicesService} from "../domain/devices-service";
import {devicesRepository} from "../repositories/devices-db-repository";
import {tokensMiddleware} from "../middlewares/tokens-middleware";
import {attemptsRepository} from "../repositories/attempts-db-repository";
import {attemptsMiddleware} from "../middlewares/attempts-middleware";
import {emailManager} from "../managers/email-manager";
import {usersRepository} from "../repositories/users-db-repository";

export const authRouter = Router({})

class AuthController {
    async login(req: Request, res: Response) {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        await attemptsRepository.addAttempt(req.ip, req.originalUrl)
        if (!user) {
            return res.sendStatus(401)
        } else {
            const token = await jwtService.createJWT(user.id)
            const refreshToken = await jwtService.createRefreshToken(user.id)
            await devicesService.createSession(req.ip, req.headers['user-agent'], refreshToken)

            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            return res.status(200).send({"accessToken": token})
        }
    }

    async passwordRecovery(req: Request, res: Response) {
        await attemptsRepository.addAttempt(req.ip, req.originalUrl);
        const user = await usersRepository.findByLoginOrEmail(req.body.email)

        if (!user) {
            return res.sendStatus(204)
        } else {
            await emailManager.sendCodeForPassword(user)
            return res.sendStatus(204)
        }
    }

    async newPassword(req: Request, res: Response) {
        await attemptsRepository.addAttempt(req.ip, req.originalUrl);
        const confirmedUser = await usersService.confirmRecoveryCode(req.body.recoveryCode);
        const inputPassword = req.body.newPassword

        if (!confirmedUser) {
            return res.status(400).send({
                errorsMessages: [
                    {
                        message: "Incorrect code",
                        field: "recoveryCode"
                    }
                ]
            })
        } else {
            await usersService.createPasswordAndUpdate(confirmedUser.id, inputPassword)
            return res.sendStatus(204)
        }
    }

    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const verify = await jwtService.verifyToken(refreshToken)

        const getUser = await jwtService.getUserIdByToken(refreshToken)
        await authRepository.blackList(refreshToken)

        const accessToken = await jwtService.createJWT(getUser)
        const newRefreshToken = await jwtService.createNewRefreshToken(getUser, verify.deviceId)

        const newToken = await authRepository.findInvalidToken(newRefreshToken)

        if (newToken !== null) {
            return res.sendStatus(401)
        } else {
            await devicesRepository.updateSession(verify.deviceId)
            res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
            return res.status(200).send({
                "accessToken": accessToken
            })
        }
    }

    async registration(req: Request, res: Response) {
        const newUser = await usersService.createUserForRegistration(req.body.login, req.body.email, req.body.password);
        await attemptsRepository.addAttempt(req.ip, req.originalUrl)
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
    }

    async registrationConfirmation(req: Request, res: Response) {
        const confirmedUser = await usersService.confirmEmail(req.body.code);
        await attemptsRepository.addAttempt(req.ip, req.originalUrl)

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
    }

    async registrationEmailResending(req: Request, res: Response) {
        const confirmedUser = await usersService.resendConfirmation(req.body.email);
        await attemptsRepository.addAttempt(req.ip, req.originalUrl)

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
    }

    async userInfo(req: Request, res: Response) {
        const user = req.user;
        const currUser = {
            email: user!.email,
            login: user!.login,
            userId: user!.id
        }

        res.status(200).send(currUser)
    }

    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const verifiedToken = await jwtService.verifyToken(refreshToken)

        await authRepository.blackList(refreshToken);
        await devicesRepository.deleteSessionById(verifiedToken.deviceId)
        return res.clearCookie('refreshToken').sendStatus(204)
    }
}

const authControllerInstance = new AuthController()

authRouter.post('/login',
    attemptsMiddleware,
    bodyAuthValidation.loginOrEmail, bodyAuthValidation.password,
    inputValidationMiddleware, authControllerInstance.login)

authRouter.post('/password-recovery',
    attemptsMiddleware,
    bodyUserValidation.email, inputValidationMiddleware,
    authControllerInstance.passwordRecovery)

authRouter.post('/new-password',
    attemptsMiddleware,
    bodyUserValidation.newPassword, bodyUserValidation.recoveryCode,
    inputValidationMiddleware,
    authControllerInstance.newPassword)

authRouter.post('/refresh-token',
    tokensMiddleware,
    authControllerInstance.refreshToken)

authRouter.post('/registration',
    attemptsMiddleware,
    bodyUserValidation.login, bodyUserValidation.email,
    bodyUserValidation.password, inputValidationMiddleware,
    authControllerInstance.registration)

authRouter.post('/registration-confirmation',
    attemptsMiddleware,
    authControllerInstance.registrationConfirmation)

authRouter.post('/registration-email-resending',
    attemptsMiddleware,
    bodyUserValidation.email, inputValidationMiddleware,
    authControllerInstance.registrationEmailResending)

authRouter.get('/me',
    authMiddleware,
    authControllerInstance.userInfo)

authRouter.post('/logout',
    tokensMiddleware,
    authControllerInstance.logout)