import {Response, Router, Request} from "express";
import {usersService} from "../domain/users-service";
import {authorisationMiddleware} from "../middlewares/authorisation-middleware";
import {bodyUserValidation} from "../middlewares/body-user-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const usersRouter = Router({})

usersRouter.get('/', async (req: Request<{}, {}, {}, genericUser>, res: Response) => {
    const allUsers = await usersService.getAllUsers(
        req.query.sortBy,
        req.query.sortDirection,
        req.query.pageNumber ? +req.query.pageNumber : 1,
        req.query.pageSize ? +req.query.pageSize : 10,
        req.query.searchLoginTerm,
        req.query.searchEmailTerm
    )

    res.status(200).send(allUsers)
})

usersRouter.post('/',
    authorisationMiddleware,
    bodyUserValidation.login, bodyUserValidation.password,
    bodyUserValidation.email, inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const createdBlog = await usersService.createUser(
            req.body.login,
            req.body.email,
            req.body.password
        )

        res.status(201).send(createdBlog)
    })

usersRouter.delete('/:id', authorisationMiddleware, async (req: Request, res: Response) => {
    const deletedUser = await usersService.deleteUser(req.params.id)

    if (!deletedUser) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})