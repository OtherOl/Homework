import {Router} from "express";
import {tokensMiddleware} from "../middlewares/tokens-middleware";
import {container} from "../compostion-root";
import {SecurityController} from "../controllers/security-controller";

const securityController = container.resolve(SecurityController)

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