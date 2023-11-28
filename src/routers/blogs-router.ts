import {Router} from "express";
import {bodyBlogValidation} from "../middlewares/body-blog-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorisationMiddleware} from "../middlewares/authorisation-middleware";
import {bodyPostValidation} from "../middlewares/body-post-validation";
import {blogsControllerInstance} from "../compostion-root";

export const blogsRouter = Router({})

blogsRouter.get('/', blogsControllerInstance.getAllBlogs.bind(blogsControllerInstance))

blogsRouter.post('/',
    authorisationMiddleware, bodyBlogValidation.name,
    bodyBlogValidation.description,
    bodyBlogValidation.websiteUrl, inputValidationMiddleware,
    blogsControllerInstance.createBlog.bind(blogsControllerInstance))

blogsRouter.get('/:blogId/posts', blogsControllerInstance.getPostByBlogId.bind(blogsControllerInstance))

blogsRouter.post('/:blogId/posts',
    authorisationMiddleware, bodyPostValidation.title,
    bodyPostValidation.shortDescription,
    bodyPostValidation.content, inputValidationMiddleware,
    blogsControllerInstance.createPostForBlog.bind(blogsControllerInstance))

blogsRouter.get('/:id', blogsControllerInstance.getBlogById.bind(blogsControllerInstance))

blogsRouter.put('/:id',
    authorisationMiddleware, bodyBlogValidation.name,
    bodyBlogValidation.description, bodyBlogValidation.websiteUrl,
    inputValidationMiddleware,
    blogsControllerInstance.updateBlog.bind(blogsControllerInstance))

blogsRouter.delete('/:id', authorisationMiddleware, blogsControllerInstance.deleteBlogById.bind(blogsControllerInstance))