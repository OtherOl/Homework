import {Router} from "express";
import {tokensMiddleware} from "../middlewares/tokens-middleware";
import {securityControllerInstance} from "../compostion-root";

export const securityRouter = Router({})

securityRouter.get('/devices',
    tokensMiddleware,
    securityControllerInstance.getAllSessions.bind(securityControllerInstance))

securityRouter.delete('/devices',
    tokensMiddleware,
    securityControllerInstance.deleteSessionsExceptOne.bind(securityControllerInstance))

securityRouter.delete('/devices/:deviceId',
    tokensMiddleware,
    securityControllerInstance.deleteSessionById.bind(securityControllerInstance))