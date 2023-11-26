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
exports.authRouter = void 0;
const express_1 = require("express");
const users_service_1 = require("../domain/users-service");
const jwt_service_1 = require("../application/jwt-service");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const body_auth_validation_1 = require("../middlewares/body-auth-validation");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const body_user_validation_1 = require("../middlewares/body-user-validation");
const auth_db_repository_1 = require("../repositories/auth-db-repository");
const devices_service_1 = require("../domain/devices-service");
const devices_db_repository_1 = require("../repositories/devices-db-repository");
const tokens_middleware_1 = require("../middlewares/tokens-middleware");
const attempts_db_repository_1 = require("../repositories/attempts-db-repository");
const attempts_middleware_1 = require("../middlewares/attempts-middleware");
const email_manager_1 = require("../managers/email-manager");
const users_db_repository_1 = require("../repositories/users-db-repository");
exports.authRouter = (0, express_1.Router)({});
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_service_1.usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
            yield attempts_db_repository_1.attemptsRepository.addAttempt(req.ip, req.originalUrl);
            if (!user) {
                return res.sendStatus(401);
            }
            else {
                const token = yield jwt_service_1.jwtService.createJWT(user.id);
                const refreshToken = yield jwt_service_1.jwtService.createRefreshToken(user.id);
                yield devices_service_1.devicesService.createSession(req.ip, req.headers['user-agent'], refreshToken);
                res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
                return res.status(200).send({ "accessToken": token });
            }
        });
    }
    passwordRecovery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield attempts_db_repository_1.attemptsRepository.addAttempt(req.ip, req.originalUrl);
            const user = yield users_db_repository_1.usersRepository.findByLoginOrEmail(req.body.email);
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
            yield attempts_db_repository_1.attemptsRepository.addAttempt(req.ip, req.originalUrl);
            const confirmedUser = yield users_service_1.usersService.confirmRecoveryCode(req.body.recoveryCode);
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
                yield users_service_1.usersService.createPasswordAndUpdate(confirmedUser.id, inputPassword);
                return res.sendStatus(204);
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const verify = yield jwt_service_1.jwtService.verifyToken(refreshToken);
            const getUser = yield jwt_service_1.jwtService.getUserIdByToken(refreshToken);
            yield auth_db_repository_1.authRepository.blackList(refreshToken);
            const accessToken = yield jwt_service_1.jwtService.createJWT(getUser);
            const newRefreshToken = yield jwt_service_1.jwtService.createNewRefreshToken(getUser, verify.deviceId);
            const newToken = yield auth_db_repository_1.authRepository.findInvalidToken(newRefreshToken);
            if (newToken !== null) {
                return res.sendStatus(401);
            }
            else {
                yield devices_db_repository_1.devicesRepository.updateSession(verify.deviceId);
                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
                return res.status(200).send({
                    "accessToken": accessToken
                });
            }
        });
    }
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield users_service_1.usersService.createUserForRegistration(req.body.login, req.body.email, req.body.password);
            yield attempts_db_repository_1.attemptsRepository.addAttempt(req.ip, req.originalUrl);
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
            const confirmedUser = yield users_service_1.usersService.confirmEmail(req.body.code);
            yield attempts_db_repository_1.attemptsRepository.addAttempt(req.ip, req.originalUrl);
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
            const confirmedUser = yield users_service_1.usersService.resendConfirmation(req.body.email);
            yield attempts_db_repository_1.attemptsRepository.addAttempt(req.ip, req.originalUrl);
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
            yield auth_db_repository_1.authRepository.blackList(refreshToken);
            yield devices_db_repository_1.devicesRepository.deleteSessionById(verifiedToken.deviceId);
            return res.clearCookie('refreshToken').sendStatus(204);
        });
    }
}
const authControllerInstance = new AuthController();
exports.authRouter.post('/login', attempts_middleware_1.attemptsMiddleware, body_auth_validation_1.bodyAuthValidation.loginOrEmail, body_auth_validation_1.bodyAuthValidation.password, input_validation_middleware_1.inputValidationMiddleware, authControllerInstance.login);
exports.authRouter.post('/password-recovery', attempts_middleware_1.attemptsMiddleware, body_user_validation_1.bodyUserValidation.email, input_validation_middleware_1.inputValidationMiddleware, authControllerInstance.passwordRecovery);
exports.authRouter.post('/new-password', attempts_middleware_1.attemptsMiddleware, body_user_validation_1.bodyUserValidation.newPassword, body_user_validation_1.bodyUserValidation.recoveryCode, input_validation_middleware_1.inputValidationMiddleware, authControllerInstance.newPassword);
exports.authRouter.post('/refresh-token', tokens_middleware_1.tokensMiddleware, authControllerInstance.refreshToken);
exports.authRouter.post('/registration', attempts_middleware_1.attemptsMiddleware, body_user_validation_1.bodyUserValidation.login, body_user_validation_1.bodyUserValidation.email, body_user_validation_1.bodyUserValidation.password, input_validation_middleware_1.inputValidationMiddleware, authControllerInstance.registration);
exports.authRouter.post('/registration-confirmation', attempts_middleware_1.attemptsMiddleware, authControllerInstance.registrationConfirmation);
exports.authRouter.post('/registration-email-resending', attempts_middleware_1.attemptsMiddleware, body_user_validation_1.bodyUserValidation.email, input_validation_middleware_1.inputValidationMiddleware, authControllerInstance.registrationEmailResending);
exports.authRouter.get('/me', auth_middleware_1.authMiddleware, authControllerInstance.userInfo);
exports.authRouter.post('/logout', tokens_middleware_1.tokensMiddleware, authControllerInstance.logout);
