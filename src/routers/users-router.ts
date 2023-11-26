import {Response, Router, Request} from "express";
import {usersService} from "../domain/users-service";
import {authorisationMiddleware} from "../middlewares/authorisation-middleware";
import {bodyUserValidation} from "../middlewares/body-user-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const usersRouter = Router({})

class UsersController {
    async getAllUsers(req: Request<{}, {}, {}, genericUser>, res: Response) {
        const allUsers = await usersService.getAllUsers(
            req.query.sortBy,
            req.query.sortDirection,
            req.query.pageNumber ? +req.query.pageNumber : 1,
            req.query.pageSize ? +req.query.pageSize : 10,
            req.query.searchLoginTerm,
            req.query.searchEmailTerm
        )

        res.status(200).send(allUsers)
    }

    async createUser(req: Request, res: Response) {
        const createdBlog = await usersService.createUser(
            req.body.login,
            req.body.email,
            req.body.password
        )

        res.status(201).send(createdBlog)
    }

    async deleteUserById(req: Request, res: Response) {
        const deletedUser = await usersService.deleteUser(req.params.id)

        if (!deletedUser) {
            res.sendStatus(404)
        } else {
            res.sendStatus(204)
        }
    }
}

const usersControllerInstance = new UsersController()

usersRouter.get('/', usersControllerInstance.getAllUsers)

usersRouter.post('/',
    authorisationMiddleware,
    bodyUserValidation.login, bodyUserValidation.password,
    bodyUserValidation.email, inputValidationMiddleware,
    usersControllerInstance.createUser)

usersRouter.delete('/:id', authorisationMiddleware, usersControllerInstance.deleteUserById)