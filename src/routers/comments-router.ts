import {Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {bodyPostValidation} from "../middlewares/body-post-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {commentsControllerInstance} from "../compostion-root";

export const commentsRouter = Router({})

commentsRouter.get('/:id', commentsControllerInstance.getCommentById.bind(commentsControllerInstance))

commentsRouter.put('/:id',
    authMiddleware,
    bodyPostValidation.comment,
    inputValidationMiddleware,
    commentsControllerInstance.updateComment.bind(commentsControllerInstance))

commentsRouter.delete('/:commentId',
    authMiddleware,
    commentsControllerInstance.deleteCommentById.bind(commentsControllerInstance))