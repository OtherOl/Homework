import {Router, Request, Response} from "express";
import {CommentsService} from "../domain/comments-service";
import {authMiddleware} from "../middlewares/auth-middleware";
import {bodyPostValidation} from "../middlewares/body-post-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {jwtService} from "../application/jwt-service";

export const commentsRouter = Router({})

class CommentsController {
    commentsService: CommentsService
    constructor() {
        this.commentsService = new CommentsService()
    }
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

const commentsControllerInstance = new CommentsController()

commentsRouter.get('/:id', commentsControllerInstance.getCommentById.bind(commentsControllerInstance))

commentsRouter.put('/:id',
    authMiddleware,
    bodyPostValidation.comment,
    inputValidationMiddleware,
    commentsControllerInstance.updateComment.bind(commentsControllerInstance))

commentsRouter.delete('/:commentId',
    authMiddleware,
    commentsControllerInstance.deleteCommentById.bind(commentsControllerInstance))