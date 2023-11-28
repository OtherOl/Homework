import {Router} from "express";
import {bodyPostValidation} from "../middlewares/body-post-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorisationMiddleware} from "../middlewares/authorisation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {postsControllerInstance} from "../compostion-root";

export const postsRouter = Router({})

postsRouter.get('/', postsControllerInstance.getAllPosts.bind(postsControllerInstance))

postsRouter.post('/',
    authorisationMiddleware, bodyPostValidation.blogId,
    bodyPostValidation.title, bodyPostValidation.shortDescription,
    bodyPostValidation.content, inputValidationMiddleware,
    postsControllerInstance.createPost.bind(postsControllerInstance))

postsRouter.get('/:id', postsControllerInstance.getPostById.bind(postsControllerInstance))

postsRouter.put('/:id',
    authorisationMiddleware, bodyPostValidation.title,
    bodyPostValidation.shortDescription, bodyPostValidation.content,
    bodyPostValidation.blogId, inputValidationMiddleware,
    postsControllerInstance.updatePost.bind(postsControllerInstance))

postsRouter.delete('/:id',
    authorisationMiddleware,
    postsControllerInstance.deletePost.bind(postsControllerInstance))

postsRouter.post('/:id/comments',
    authMiddleware,
    bodyPostValidation.comment, inputValidationMiddleware,
    postsControllerInstance.createCommentForPost.bind(postsControllerInstance))

postsRouter.get('/:id/comments', postsControllerInstance.getCommentById.bind(postsControllerInstance))
