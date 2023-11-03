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
exports.authMiddleware = void 0;
const jwt_service_1 = require("../application/jwt-service");
const users_service_1 = require("../domain/users-service");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = req.headers.authorization;
    const refreshToken = req.cookies.refreshToken;
    // if (!req.headers.authorization) {
    //     return res.sendStatus(401)
    // }
    if (!accessToken || !refreshToken) {
        return res.sendStatus(401);
    }
    // const token = req.headers.authorization.split(" ")[1]
    console.log(refreshToken);
    const token = refreshToken;
    console.log(token);
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
    // console.log(token)
    // console.log(userId)
    if (userId) {
        req.user = yield users_service_1.usersService.findUserById(userId);
        next();
        return;
    }
    else {
        return res.sendStatus(401);
    }
});
exports.authMiddleware = authMiddleware;
