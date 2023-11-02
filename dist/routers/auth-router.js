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
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/login', body_auth_validation_1.bodyAuthValidation.loginOrEmail, body_auth_validation_1.bodyAuthValidation.password, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_service_1.usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (!user) {
        return res.sendStatus(401);
    }
    else {
        const token = yield jwt_service_1.jwtService.createJWT(user);
        const refreshToken = yield jwt_service_1.jwtService.createRefreshToken(user);
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
        return res.status(200).send({ "accessToken": token });
    }
}));
exports.authRouter.post('/refresh-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const verify = yield jwt_service_1.jwtService.verifyToken(refreshToken);
    const black = yield auth_db_repository_1.authRepository.findInvalidToken(refreshToken);
    if (!verify || black !== null) {
        return res.sendStatus(401);
    }
    const accessToken = yield jwt_service_1.jwtService.createJWT(verify);
    const refToken = yield jwt_service_1.jwtService.createRefreshToken(verify);
    const newToken = yield auth_db_repository_1.authRepository.findInvalidToken(refToken);
    yield auth_db_repository_1.authRepository.blackList(refreshToken);
    if (newToken !== null) {
        return res.sendStatus(401);
    }
    else {
        res.cookie('refreshToken', refToken, { httpOnly: true, secure: true });
        return res.status(200).send({
            "accessToken": accessToken
        });
    }
}));
exports.authRouter.post('/registration', body_user_validation_1.bodyUserValidation.login, body_user_validation_1.bodyUserValidation.email, body_user_validation_1.bodyUserValidation.password, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield users_service_1.usersService.createUserForRegistration(req.body.login, req.body.email, req.body.password);
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
}));
exports.authRouter.post('/registration-confirmation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const confirmedUser = yield users_service_1.usersService.confirmEmail(req.body.code);
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
}));
exports.authRouter.post('/registration-email-resending', body_user_validation_1.bodyUserValidation.email, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const confirmedUser = yield users_service_1.usersService.resendConfirmation(req.body.email);
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
}));
exports.authRouter.get('/me', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const currUser = {
        email: user.email,
        login: user.login,
        userId: user.id
    };
    res.status(200).send(currUser);
}));
exports.authRouter.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    const result = yield jwt_service_1.jwtService.verifyToken(refreshToken);
    const black = yield auth_db_repository_1.authRepository.findInvalidToken(refreshToken);
    if (!result || black !== null) {
        return res.sendStatus(401);
    }
    else {
        yield auth_db_repository_1.authRepository.blackList(refreshToken);
        return res.clearCookie("refreshToken").sendStatus(204);
    }
}));
