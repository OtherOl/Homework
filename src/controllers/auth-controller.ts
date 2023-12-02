import {UsersService} from "../domain/users-service";
import {UsersRepository} from "../repositories/users-repository";
import {AttemptsRepository} from "../repositories/attempts-repository";
import {AuthRepository} from "../repositories/auth-repository";
import {DevicesRepository} from "../repositories/devices-repository";
import {DevicesService} from "../domain/devices-service";
import {Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {emailManager} from "../managers/email-manager";

export class AuthController {
    constructor(
        protected usersService: UsersService,
        protected usersRepository: UsersRepository,
        protected attemptsRepository: AttemptsRepository,
        protected authRepository: AuthRepository,
        protected devicesRepository: DevicesRepository,
        protected devicesService: DevicesService
    ) {}
    async login(req: Request, res: Response) {
        const user = await this.usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        await this.attemptsRepository.addAttempt(req.ip, req.originalUrl)
        if (!user) {
            return res.sendStatus(401)
        } else {
            const token = await jwtService.createJWT(user.id)
            const refreshToken = await jwtService.createRefreshToken(user.id)
            await this.devicesService.createSession(req.ip, req.headers['user-agent'], refreshToken)

            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            return res.status(200).send({"accessToken": token})
        }
    }

    async passwordRecovery(req: Request, res: Response) {
        await this.attemptsRepository.addAttempt(req.ip, req.originalUrl);
        const user = await this.usersRepository.findByLoginOrEmail(req.body.email)

        if (!user) {
            return res.sendStatus(204)
        } else {
            await emailManager.sendCodeForPassword(user)
            return res.sendStatus(204)
        }
    }

    async newPassword(req: Request, res: Response) {
        await this.attemptsRepository.addAttempt(req.ip, req.originalUrl);
        const confirmedUser = await this.usersService.confirmRecoveryCode(req.body.recoveryCode);
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
            await this.usersService.createPasswordAndUpdate(confirmedUser.id, inputPassword)
            return res.sendStatus(204)
        }
    }

    async refreshToken(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const verify = await jwtService.verifyToken(refreshToken)

        const getUser = await jwtService.getUserIdByToken(refreshToken)
        await this.authRepository.blackList(refreshToken)

        const accessToken = await jwtService.createJWT(getUser)
        const newRefreshToken = await jwtService.createNewRefreshToken(getUser, verify.deviceId)

        const newToken = await this.authRepository.findInvalidToken(newRefreshToken)

        if (newToken !== null) {
            return res.sendStatus(401)
        } else {
            await this.devicesRepository.updateSession(verify.deviceId)
            res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true})
            return res.status(200).send({
                "accessToken": accessToken
            })
        }
    }

    async registration(req: Request, res: Response) {
        const newUser = await this.usersService.createUserForRegistration(req.body.login, req.body.email, req.body.password);
        await this.attemptsRepository.addAttempt(req.ip, req.originalUrl)
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
        const confirmedUser = await this.usersService.confirmEmail(req.body.code);
        await this.attemptsRepository.addAttempt(req.ip, req.originalUrl)

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
        const confirmedUser = await this.usersService.resendConfirmation(req.body.email);
        await this.attemptsRepository.addAttempt(req.ip, req.originalUrl)

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

        const token = req.headers.authorization!.split(" ")[1]
        await this.authRepository.blackList(token)
        await this.authRepository.blackList(refreshToken);
        await this.devicesRepository.deleteSessionById(verifiedToken.deviceId)
        return res.clearCookie('refreshToken').sendStatus(204)
    }
}