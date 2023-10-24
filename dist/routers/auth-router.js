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
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/login', body_auth_validation_1.bodyAuthValidation.loginOrEmail, body_auth_validation_1.bodyAuthValidation.password, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_service_1.usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (!user) {
        res.sendStatus(401);
    }
    else {
        const token = yield jwt_service_1.jwtService.createJWT(user);
        res.status(200).send(token);
    }
}));
exports.authRouter.post('/registration', body_user_validation_1.bodyUserValidation.login, body_user_validation_1.bodyUserValidation.email, body_user_validation_1.bodyUserValidation.password, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield users_service_1.usersService.createUser(req.body.login, req.body.email, req.body.password);
    if (newUser === false) {
        res.sendStatus(400);
    }
    else {
        res.sendStatus(204);
    }
}));
exports.authRouter.get('/me', auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    return {
        email: user.email,
        login: user.login,
        userId: user.id
    };
}));
