import {Router} from "express";
import {bodyBlogValidation} from "../middlewares/body-blog-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorisationMiddleware} from "../middlewares/authorisation-middleware";
import {bodyPostValidation} from "../middlewares/body-post-validation";
import {blogsController} from "../compostion-root";

export const blogsRouter = Router({})

blogsRouter.get('/', blogsController.getAllBlogs.bind(blogsController))

blogsRouter.post('/',
    authorisationMiddleware, bodyBlogValidation.name,
    bodyBlogValidation.description,
    bodyBlogValidation.websiteUrl, inputValidationMiddleware,
    blogsController.createBlog.bind(blogsController))

blogsRouter.get('/:blogId/posts', blogsController.getPostByBlogId.bind(blogsController))

blogsRouter.post('/:blogId/posts',
    authorisationMiddleware, bodyPostValidation.title,
    bodyPostValidation.shortDescription,
    bodyPostValidation.content, inputValidationMiddleware,
    blogsController.createPostForBlog.bind(blogsController))

blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController))

blogsRouter.put('/:id',
    authorisationMiddleware, bodyBlogValidation.name,
    bodyBlogValidation.description, bodyBlogValidation.websiteUrl,
    inputValidationMiddleware,
    blogsController.updateBlog.bind(blogsController))

blogsRouter.delete('/:id', authorisationMiddleware, blogsController.deleteBlogById.bind(blogsController))