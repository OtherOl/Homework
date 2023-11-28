import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";

export class UsersController {
    constructor(protected usersService: UsersService) {
    }

    async getAllUsers(req: Request<{}, {}, {}, genericUser>, res: Response) {
        const allUsers = await this.usersService.getAllUsers(
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
        const createdBlog = await this.usersService.createUser(
            req.body.login,
            req.body.email,
            req.body.password
        )

        res.status(201).send(createdBlog)
    }

    async deleteUserById(req: Request, res: Response) {
        const deletedUser = await this.usersService.deleteUser(req.params.id)

        if (!deletedUser) {
            res.sendStatus(404)
        } else {
            res.sendStatus(204)
        }
    }
}