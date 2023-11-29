import {Router} from "express";
import {bodyPostValidation} from "../middlewares/body-post-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorisationMiddleware} from "../middlewares/authorisation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {postsController} from "../compostion-root";

export const postsRouter = Router({})

postsRouter.get('/', postsController.getAllPosts.bind(postsController))

postsRouter.post('/',
    authorisationMiddleware, bodyPostValidation.blogId,
    bodyPostValidation.title, bodyPostValidation.shortDescription,
    bodyPostValidation.content, inputValidationMiddleware,
    postsController.createPost.bind(postsController))

postsRouter.get('/:id', postsController.getPostById.bind(postsController))

postsRouter.put('/:id',
    authorisationMiddleware, bodyPostValidation.title,
    bodyPostValidation.shortDescription, bodyPostValidation.content,
    bodyPostValidation.blogId, inputValidationMiddleware,
    postsController.updatePost.bind(postsController))

postsRouter.delete('/:id',
    authorisationMiddleware,
    postsController.deletePost.bind(postsController))

postsRouter.post('/:id/comments',
    authMiddleware,
    bodyPostValidation.comment, inputValidationMiddleware,
    postsController.createCommentForPost.bind(postsController))

postsRouter.get('/:id/comments', postsController.getCommentById.bind(postsController))
