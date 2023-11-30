import {PostsService} from "../domain/posts-service";
import {Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {likesModel} from "../models/likes-model";
import {LikesService} from "../domain/likes-service";

export class PostsController {
    constructor(
        protected postsService: PostsService,
        protected likesService: LikesService
    ) {
    }

    async getAllPosts(req: Request<{}, {}, {}, blogGeneric>, res: Response) {
        const allPosts = await this.postsService.getAllPosts(
            req.query.sortBy, req.query.sortDirection,
            req.query.pageNumber ? +req.query.pageNumber : 1,
            req.query.pageSize ? +req.query.pageSize : 10
        )
        res.status(200).send(allPosts)
    }

    async createPost(req: Request, res: Response) {
        const {title, shortDescription, content, blogId} = req.body

        const newPost = await this.postsService.createPost({blogId, content, title, shortDescription})
        res.status(201).send(newPost)
    }

    async getPostById(req: Request, res: Response) {
        const foundPost = await this.postsService.getPostById(req.params.id)
        if (!foundPost) {
            res.sendStatus(404)
        } else {
            res.status(200).send(foundPost)
        }
    }

    async updatePost(req: Request, res: Response) {
        const {title, shortDescription, content, blogId} = req.body

        const updatedPost = await this.postsService.updatePost(req.params.id, req.body)

        if (updatedPost) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }

    }

    async deletePost(req: Request, res: Response) {
        const successDel = await this.postsService.deletePost(req.params.id)

        if (!successDel) {
            res.sendStatus(404)
        } else {
            res.sendStatus(204)
        }
    }

    async createCommentForPost(req: Request, res: Response) {
        const comment = await this.postsService.createComment(req.params.id, req.body.content, req.user!.id)

        if (!comment) {
            res.sendStatus(404)
        } else {
            res.status(201).send(comment)
        }
    }

    async getCommentById(req: Request<{ id: string }, {}, {}, commentGeneric>, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const userId = await jwtService.getUserIdByToken(refreshToken)
        const like: likesModel | null = await this.likesService.getLikeByUserId(userId)
        const comment = await this.postsService.getCommentById(
            req.params.id,
            req.query.pageNumber ? +req.query.pageNumber : 1,
            req.query.pageSize ? +req.query.pageSize : 10,
            req.query.sortBy, req.query.sortDirection, like
        )

        if (!comment) {
            res.sendStatus(404)
        } else {
            res.status(200).send(comment)
        }
    }
}