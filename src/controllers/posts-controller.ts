import {PostsService} from "../domain/posts-service";
import {Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {LikesService} from "../domain/likes-service";
import {CommentsService} from "../domain/comments-service";
import {likesPostModel} from "../models/likes-model";
import {UsersService} from "../domain/users-service";
import {injectable} from "inversify";

@injectable()
export class PostsController {
    constructor(
        protected postsService: PostsService,
        protected likesService: LikesService,
        protected commentsService: CommentsService,
        private usersService: UsersService
    ) {}

    async getAllPosts(req: Request<{}, {}, {}, blogGeneric>, res: Response) {
        const accessToken = req.headers.authorization
        const userId = await jwtService.getUserIdByToken(accessToken?.split(" ")[1])
        const allPosts = await this.postsService.getAllPosts(
            req.query.sortBy, req.query.sortDirection,
            req.query.pageNumber ? +req.query.pageNumber : 1,
            req.query.pageSize ? +req.query.pageSize : 10, userId
        )
        res.status(200).send(allPosts)
    }

    async createPost(req: Request, res: Response) {
        const {title, shortDescription, content, blogId} = req.body

        const newPost = await this.postsService.createPost({blogId, content, title, shortDescription})
        res.status(201).send(newPost)
    }

    async getPostById(req: Request, res: Response) {
        const accessToken = req.headers.authorization
        const foundPost = await this.postsService.getPostById(req.params.id, accessToken)
        if (!foundPost) {
            res.sendStatus(404)
        } else {
            res.status(200).send(foundPost)
        }
    }

    async updatePost(req: Request, res: Response) {
        const {title, shortDescription, content, blogId} = req.body

        const updatedPost = await this.postsService.updatePost(req.params.id, {title, shortDescription, content, blogId})

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
            return res.sendStatus(404)
        } else {
            return res.status(201).send(comment)
        }
    }

    async getCommentById(req: Request<{ id: string }, {}, {}, commentGeneric>, res: Response) {
        const accessToken = req.headers.authorization
        const userId = await jwtService.getUserIdByToken(accessToken?.split(" ")[1])

        const comment = await this.postsService.getCommentById(
            req.params.id,
            req.query.pageNumber ? +req.query.pageNumber : 1,
            req.query.pageSize ? +req.query.pageSize : 10,
            req.query.sortBy, req.query.sortDirection, userId
        )

        if (!comment) {
            return res.sendStatus(404)
        } else {
            return res.status(200).send(comment)
        }
    }

    async doLikesDislikes(req: Request, res: Response) {
        const accessToken = req.headers.authorization
        const post = await this.postsService.getPostById(req.params.id, accessToken!.split("")[1])
        const userId = await jwtService.getUserIdByToken(accessToken!.split(" ")[1])
        const userLogin = await this.usersService.findUserById(userId)
        if(!post) return res.sendStatus(404)

        if(req.body.likeStatus === "Like") {
            const like: likesPostModel | null = await this.likesService.getLikeByUserIdPost(userId, post.id)
            if(!like) {
                await this.likesService.createPostLike(null, "Like", userId, post.id, userLogin!.login)
                return res.sendStatus(204)
            } else {
                await this.likesService.createPostLike(like, "Like", userId, post.id, userLogin!.login)
                return res.sendStatus(204)
            }
        }

        if(req.body.likeStatus === "Dislike") {
            const like: likesPostModel | null = await this.likesService.getLikeByUserIdPost(userId, post.id)
            if(!like) {
                await this.likesService.createPostDislike(null, "Dislike", userId, post.id, userLogin!.login)
                return res.sendStatus(204)
            } else {
                await this.likesService.createPostDislike(like, "Dislike", userId, post.id, userLogin!.login)
                return res.sendStatus(204)
            }
        }

        if(req.body.likeStatus === "None") {
            const like: likesPostModel | null = await this.likesService.getLikeByUserIdPost(userId, post.id)
            if(!like) return res.sendStatus(204)
            if(like.type === "Like") {
                await this.likesService.updateToNone(like)
                return res.sendStatus(204)
            }
            if(like.type === "Dislike") {
                await this.likesService.updateToNone(like)
                return res.sendStatus(204)
            }
            return res.sendStatus(204)
        }
    }
}