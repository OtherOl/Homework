import {Router} from "express";
import {authorisationMiddleware} from "../middlewares/authorisation-middleware";
import {bodyUserValidation} from "../middlewares/body-user-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {container} from "../compostion-root";
import {UsersController} from "../controllers/users-controller";

const usersController = container.resolve(UsersController)

export const usersRouter = Router({})

usersRouter.get('/', usersController.getAllUsers.bind(usersController))

usersRouter.post('/',
    authorisationMiddleware,
    bodyUserValidation.login, bodyUserValidation.password,
    bodyUserValidation.email, inputValidationMiddleware,
    usersController.createUser.bind(usersController))

usersRouter.delete('/:id', authorisationMiddleware, usersController.deleteUserById.bind(usersController))