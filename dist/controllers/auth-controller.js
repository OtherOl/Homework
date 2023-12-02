"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jwt_service_1 = require("../application/jwt-service");
const email_manager_1 = require("../managers/email-manager");
class AuthController {
    constructor(usersService, usersRepository, attemptsRepository, authRepository, devicesRepository, devicesService) {
        this.usersService = usersService;
        this.usersRepository = usersRepository;
        this.attemptsRepository = attemptsRepository;
        this.authRepository = authRepository;
        this.devicesRepository = devicesRepository;
        this.devicesService = devicesService;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
            yield this.attemptsRepository.addAttempt(req.ip, req.originalUrl);
            if (!user) {
                return res.sendStatus(401);
            }
            else {
                const token = yield jwt_service_1.jwtService.createJWT(user.id);
                const refreshToken = yield jwt_service_1.jwtService.createRefreshToken(user.id);
                yield this.devicesService.createSession(req.ip, req.headers['user-agent'], refreshToken);
                res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
                return res.status(200).send({ "accessToken": token });
            }
        });
    }
    passwordRecovery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.attemptsRepository.addAttempt(req.ip, req.originalUrl);
            const user = yield this.usersRepository.findByLoginOrEmail(req.body.email);
            if (!user) {
                return res.sendStatus(204);
            }
            else {
                yield email_manager_1.emailManager.sendCodeForPassword(user);
                return res.sendStatus(204);
            }
        });
    }
    newPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.attemptsRepository.addAttempt(req.ip, req.originalUrl);
            const confirmedUser = yield this.usersService.confirmRecoveryCode(req.body.recoveryCode);
            const inputPassword = req.body.newPassword;
            if (!confirmedUser) {
                return res.status(400).send({
                    errorsMessages: [
                        {
                            message: "Incorrect code",
                            field: "recoveryCode"
                        }
                    ]
                });
            }
            else {
                yield this.usersService.createPasswordAndUpdate(confirmedUser.id, inputPassword);
                return res.sendStatus(204);
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const verify = yield jwt_service_1.jwtService.verifyToken(refreshToken);
            const getUser = yield jwt_service_1.jwtService.getUserIdByToken(refreshToken);
            yield this.authRepository.blackList(refreshToken);
            const accessToken = yield jwt_service_1.jwtService.createJWT(getUser);
            const newRefreshToken = yield jwt_service_1.jwtService.createNewRefreshToken(getUser, verify.deviceId);
            const newToken = yield this.authRepository.findInvalidToken(newRefreshToken);
            if (newToken !== null) {
                return res.sendStatus(401);
            }
            else {
                yield this.devicesRepository.updateSession(verify.deviceId);
                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
                return res.status(200).send({
                    "accessToken": accessToken
                });
            }
        });
    }
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield this.usersService.createUserForRegistration(req.body.login, req.body.email, req.body.password);
            yield this.attemptsRepository.addAttempt(req.ip, req.originalUrl);
            if (newUser === "email exists") {
                return res.status(400).send({
                    errorsMessages: [
                        {
                            message: "User with current email already exists",
                            field: "email"
                        }
                    ]
                });
            }
            else if (newUser === "login exists") {
                return res.status(400).send({
                    errorsMessages: [
                        {
                            message: "User with current login already exists",
                            field: "login"
                        }
                    ]
                });
            }
            res.sendStatus(204);
        });
    }
    registrationConfirmation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmedUser = yield this.usersService.confirmEmail(req.body.code);
            yield this.attemptsRepository.addAttempt(req.ip, req.originalUrl);
            if (!confirmedUser) {
                return res.status(400).send({
                    errorsMessages: [
                        {
                            message: "Incorrect code",
                            field: "code"
                        }
                    ]
                });
            }
            else {
                return res.sendStatus(204);
            }
        });
    }
    registrationEmailResending(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmedUser = yield this.usersService.resendConfirmation(req.body.email);
            yield this.attemptsRepository.addAttempt(req.ip, req.originalUrl);
            if (confirmedUser === "User doesn't exists") {
                return res.status(400).send({
                    errorsMessages: [
                        {
                            message: "User with current email doesn't exists",
                            field: "email"
                        }
                    ]
                });
            }
            else if (confirmedUser === "User already confirmed") {
                return res.status(400).send({
                    errorsMessages: [
                        {
                            message: "User with current email already confirmed",
                            field: "email"
                        }
                    ]
                });
            }
            res.sendStatus(204);
        });
    }
    userInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const currUser = {
                email: user.email,
                login: user.login,
                userId: user.id
            };
            res.status(200).send(currUser);
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const verifiedToken = yield jwt_service_1.jwtService.verifyToken(refreshToken);
            const token = req.headers.authorization.split(" ")[1];
            yield this.authRepository.blackList(token);
            yield this.authRepository.blackList(refreshToken);
            yield this.devicesRepository.deleteSessionById(verifiedToken.deviceId);
            return res.clearCookie('refreshToken').sendStatus(204);
        });
    }
}
exports.AuthController = AuthController;
