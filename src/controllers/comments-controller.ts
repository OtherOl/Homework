import {CommentsService} from "../domain/comments-service";
import {Request, Response} from "express";
import {jwtService} from "../application/jwt-service";

export class CommentsController {
    constructor(protected commentsService: CommentsService) {}
    async getCommentById(req: Request, res: Response) {
        const comment = await this.commentsService.getCommentById(req.params.id)

        if (!comment) {
            res.sendStatus(404)
        } else {
            res.status(200).send(comment)
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
}