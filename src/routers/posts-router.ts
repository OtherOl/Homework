import {Request, Response, Router} from "express";
import {bodyPostValidation} from "../middlewares/body-post-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorisationMiddleware} from "../middlewares/authorisation-middleware";
import {postsService} from "../domain/posts-service";
import {authMiddleware} from "../middlewares/auth-middleware";

export const postsRouter = Router({})

class PostsController {
    async getAllPosts(req: Request<{}, {}, {}, blogGeneric>, res: Response) {
        const allPosts = await postsService.getAllPosts(
            req.query.sortBy, req.query.sortDirection,
            req.query.pageNumber ? +req.query.pageNumber : 1,
            req.query.pageSize ? +req.query.pageSize : 10
        )
        res.status(200).send(allPosts)
    }

    async createPost(req: Request, res: Response) {
        const {title, shortDescription, content, blogId} = req.body

        const newPost = await postsService.createPost({blogId, content, title, shortDescription})
        res.status(201).send(newPost)
    }

    async getPostById(req: Request, res: Response) {
        const foundPost = await postsService.getPostById(req.params.id)
        if (!foundPost) {
            res.sendStatus(404)
        } else {
            res.status(200).send(foundPost)
        }
    }

    async updatePost(req: Request, res: Response) {
        const {title, shortDescription, content, blogId} = req.body

        const updatedPost = await postsService.updatePost(req.params.id, req.body)

        if (updatedPost) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }

    }

    async deletePost(req: Request, res: Response) {
        const successDel = await postsService.deletePost(req.params.id)

        if (!successDel) {
            res.sendStatus(404)
        } else {
            res.sendStatus(204)
        }
    }

    async createCommentForPost(req: Request, res: Response) {
        const comment = await postsService.createComment(req.params.id, req.body.content, req.user!.id)

        if (!comment) {
            res.sendStatus(404)
        } else {
            res.status(201).send(comment)
        }
    }

    async getCommentById(req: Request<{ id: string }, {}, {}, commentGeneric>, res: Response) {
        const comment = await postsService.getCommentById(
            req.params.id,
            req.query.pageNumber ? +req.query.pageNumber : 1,
            req.query.pageSize ? +req.query.pageSize : 10,
            req.query.sortBy, req.query.sortDirection
        )

        if (!comment) {
            res.sendStatus(404)
        } else {
            res.status(200).send(comment)
        }
    }
}

const postsControllerInstance = new PostsController()

postsRouter.get('/', postsControllerInstance.getAllPosts)

postsRouter.post('/',
    authorisationMiddleware, bodyPostValidation.blogId,
    bodyPostValidation.title, bodyPostValidation.shortDescription,
    bodyPostValidation.content, inputValidationMiddleware,
    postsControllerInstance.createPost)

postsRouter.get('/:id', postsControllerInstance.getPostById)

postsRouter.put('/:id',
    authorisationMiddleware, bodyPostValidation.title,
    bodyPostValidation.shortDescription, bodyPostValidation.content,
    bodyPostValidation.blogId, inputValidationMiddleware,
    postsControllerInstance.updatePost)

postsRouter.delete('/:id',
    authorisationMiddleware,
    postsControllerInstance.deletePost)

postsRouter.post('/:id/comments',
    authMiddleware,
    bodyPostValidation.comment, inputValidationMiddleware,
    postsControllerInstance.createCommentForPost)

postsRouter.get('/:id/comments', postsControllerInstance.getCommentById)
