import {Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {bodyAuthValidation} from "../middlewares/body-auth-validation";
import {authMiddleware} from "../middlewares/auth-middleware";
import {bodyUserValidation} from "../middlewares/body-user-validation";
import {tokensMiddleware} from "../middlewares/tokens-middleware";
import {attemptsMiddleware} from "../middlewares/attempts-middleware";
import {container} from "../compostion-root";
import {AuthController} from "../controllers/auth-controller";

const authController = container.resolve(AuthController)

export const authRouter = Router({})

authRouter.post('/login',
    attemptsMiddleware,
    bodyAuthValidation.loginOrEmail, bodyAuthValidation.password,
    inputValidationMiddleware, authController.login.bind(authController))

authRouter.post('/password-recovery',
    attemptsMiddleware,
    bodyUserValidation.email, inputValidationMiddleware,
    authController.passwordRecovery.bind(authController))

authRouter.post('/new-password',
    attemptsMiddleware,
    bodyUserValidation.newPassword, bodyUserValidation.recoveryCode,
    inputValidationMiddleware,
    authController.newPassword.bind(authController))

authRouter.post('/refresh-token',
    tokensMiddleware,
    authController.refreshToken.bind(authController))

authRouter.post('/registration',
    attemptsMiddleware,
    bodyUserValidation.login, bodyUserValidation.email,
    bodyUserValidation.password, inputValidationMiddleware,
    authController.registration.bind(authController))

authRouter.post('/registration-confirmation',
    attemptsMiddleware,
    authController.registrationConfirmation.bind(authController))

authRouter.post('/registration-email-resending',
    attemptsMiddleware,
    bodyUserValidation.email, inputValidationMiddleware,
    authController.registrationEmailResending.bind(authController))

authRouter.get('/me',
    authMiddleware,
    authController.userInfo.bind(authController))

authRouter.post('/logout',
    tokensMiddleware,
    authController.logout.bind(authController))