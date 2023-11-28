import {Router} from "express";
import {authorisationMiddleware} from "../middlewares/authorisation-middleware";
import {bodyUserValidation} from "../middlewares/body-user-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersControllerInstance} from "../compostion-root";

export const usersRouter = Router({})

usersRouter.get('/', usersControllerInstance.getAllUsers.bind(usersControllerInstance))

usersRouter.post('/',
    authorisationMiddleware,
    bodyUserValidation.login, bodyUserValidation.password,
    bodyUserValidation.email, inputValidationMiddleware,
    usersControllerInstance.createUser.bind(usersControllerInstance))

usersRouter.delete('/:id', authorisationMiddleware, usersControllerInstance.deleteUserById.bind(usersControllerInstance))