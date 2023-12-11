import {Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {bodyPostValidation} from "../middlewares/body-post-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {container} from "../compostion-root";
import {CommentsController} from "../controllers/comments-controller";

const commentsController = container.resolve(CommentsController)

export const commentsRouter = Router({})

commentsRouter.get('/:id', commentsController.getCommentById.bind(commentsController))

commentsRouter.put('/:id',
    authMiddleware,
    bodyPostValidation.comment,
    inputValidationMiddleware,
    commentsController.updateComment.bind(commentsController))

commentsRouter.put('/:id/like-status',
    authMiddleware,
    bodyPostValidation.likeStatus,
    inputValidationMiddleware,
    commentsController.doLikeDislike.bind(commentsController))

commentsRouter.delete('/:commentId',
    authMiddleware,
    commentsController.deleteCommentById.bind(commentsController))