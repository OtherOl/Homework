import {Router} from "express";
import {tokensMiddleware} from "../middlewares/tokens-middleware";
import {securityController} from "../compostion-root";

export const securityRouter = Router({})

securityRouter.get('/devices',
    tokensMiddleware,
    securityController.getAllSessions.bind(securityController))

securityRouter.delete('/devices',
    tokensMiddleware,
    securityController.deleteSessionsExceptOne.bind(securityController))

securityRouter.delete('/devices/:deviceId',
    tokensMiddleware,
    securityController.deleteSessionById.bind(securityController))