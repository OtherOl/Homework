import {Router} from "express";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {bodyAuthValidation} from "../middlewares/body-auth-validation";
import {authMiddleware} from "../middlewares/auth-middleware";
import {bodyUserValidation} from "../middlewares/body-user-validation";
import {tokensMiddleware} from "../middlewares/tokens-middleware";
import {attemptsMiddleware} from "../middlewares/attempts-middleware";
import {authControllerInstance} from "../compostion-root";

export const authRouter = Router({})

authRouter.post('/login',
    attemptsMiddleware,
    bodyAuthValidation.loginOrEmail, bodyAuthValidation.password,
    inputValidationMiddleware, authControllerInstance.login.bind(authControllerInstance))

authRouter.post('/password-recovery',
    attemptsMiddleware,
    bodyUserValidation.email, inputValidationMiddleware,
    authControllerInstance.passwordRecovery.bind(authControllerInstance))

authRouter.post('/new-password',
    attemptsMiddleware,
    bodyUserValidation.newPassword, bodyUserValidation.recoveryCode,
    inputValidationMiddleware,
    authControllerInstance.newPassword.bind(authControllerInstance))

authRouter.post('/refresh-token',
    tokensMiddleware,
    authControllerInstance.refreshToken.bind(authControllerInstance))

authRouter.post('/registration',
    attemptsMiddleware,
    bodyUserValidation.login, bodyUserValidation.email,
    bodyUserValidation.password, inputValidationMiddleware,
    authControllerInstance.registration.bind(authControllerInstance))

authRouter.post('/registration-confirmation',
    attemptsMiddleware,
    authControllerInstance.registrationConfirmation.bind(authControllerInstance))

authRouter.post('/registration-email-resending',
    attemptsMiddleware,
    bodyUserValidation.email, inputValidationMiddleware,
    authControllerInstance.registrationEmailResending.bind(authControllerInstance))

authRouter.get('/me',
    authMiddleware,
    authControllerInstance.userInfo.bind(authControllerInstance))

authRouter.post('/logout',
    tokensMiddleware,
    authControllerInstance.logout.bind(authControllerInstance))