import {CommentsService} from "../domain/comments-service";
import {Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {LikesService} from "../domain/likes-service";
import {likesModel} from "../models/likes-model";

export class CommentsController {
    constructor(
        protected commentsService: CommentsService,
        protected likesService: LikesService
        ) {
    }

    async getCommentById(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const userId = await jwtService.getUserIdByToken(refreshToken)
        const like: likesModel | null = await this.likesService.getLikeByUserId(userId)
        const comment = await this.commentsService.getCommentById(req.params.id, like)
        if (!comment) {
            return res.sendStatus(404)
        } else {
            return res.status(200).send(comment)
        }
    }

    async updateComment(req: Request, res: Response) {
        const token = req.headers.authorization!.split(" ")[1]
        const userId = await jwtService.getUserIdByToken(token)

        const updatedComment = await this.commentsService.updateComment(
            req.params.id,
            req.body.content,
        );

        if (!updatedComment) {
            res.sendStatus(404)
        } else if (updatedComment.commentatorInfo.userId !== userId) {
            res.sendStatus(403)
        } else {
            res.sendStatus(204)
        }

    }

    async deleteCommentById(req: Request, res: Response) {
        const token = req.headers.authorization!.split(" ")[1]
        const userId = await jwtService.getUserIdByToken(token)

        const comment = await this.commentsService.deleteCommentById(req.params.commentId);

        if (!comment) {
            res.sendStatus(404)
        } else if (comment.commentatorInfo.userId !== userId) {
            res.sendStatus(403)
        } else {
            res.sendStatus(204)
        }
    }

    async doLikeDislike(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const userId = await jwtService.getUserIdByToken(refreshToken)
        const comment = await this.commentsService.getCommentById(req.params.id)
        if (!comment) return res.sendStatus(404)
        if (req.body.likeStatus === "Like") {
            await this.likesService.createLike("Like", userId, comment.id)
            return res.sendStatus(204)
        }
        if (req.body.likeStatus === "Dislike") {
            await this.likesService.createDislike("Dislike", userId, comment.id)
            return res.sendStatus(204)
        }
        if (req.body.likeStatus === "None") return res.sendStatus(204)
    }
}