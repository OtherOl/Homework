import {Request, Response, Router} from "express";
import {bodyBlogValidation} from "../middlewares/body-blog-validation";
import {BlogsService} from "../domain/blogs-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorisationMiddleware} from "../middlewares/authorisation-middleware";
import {bodyPostValidation} from "../middlewares/body-post-validation";
import {PostsService} from "../domain/posts-service";

export const blogsRouter = Router({})

class BlogsController {
    blogsService: BlogsService
    postsService: PostsService
    constructor() {
        this.blogsService = new BlogsService()
        this.postsService = new PostsService()
    }
    async getAllBlogs(req: Request<{}, {}, {}, blogGeneric>, res: Response) {
        const allBlogs = await this.blogsService.getAllBlogs(
            req.query.searchNameTerm, req.query.sortBy,
            req.query.sortDirection, req.query.pageNumber ? +req.query.pageNumber : 1,
            req.query.pageSize ? +req.query.pageSize : 10
        )
        res.status(200).send(allBlogs)
    }

    async createBlog(req: Request, res: Response) {
        const {name, description, websiteUrl} = req.body
        const newBlog = await this.blogsService.createBlog({name, description, websiteUrl})

        res.status(201).send(newBlog)
    }

    async getPostByBlogId(req: Request<{ blogId: string }, {}, {}, blogGeneric>, res: Response) {
        const foundPost = await this.blogsService.getPostByBlogId(
            req.params.blogId, req.query.sortBy,
            req.query.sortDirection, req.query.pageNumber ? +req.query.pageNumber : 1,
            req.query.pageSize ? +req.query.pageSize : 10
        )

        if (foundPost === false) {
            res.sendStatus(404)
        } else {
            res.status(200).send(foundPost)
        }
    }

    async createPostForBlog(req: Request, res: Response) {
        const blogId = req.params.blogId
        const {title, shortDescription, content} = req.body

        const newPost = await this.postsService.createPost({blogId, content, title, shortDescription})

        if (!newPost) {
            res.sendStatus(404)
        } else {
            res.status(201).send(newPost)
        }
    }

    async getBlogById(req: Request, res: Response) {
        let findBlog = await this.blogsService.getBlogById(req.params.id)

        if (!findBlog) {
            res.sendStatus(404)
        } else {
            res.status(200).send(findBlog)
        }
    }

    async updateBlog(req: Request, res: Response) {
        const {name, description, websiteUrl} = req.body

        const updatedBlog = await this.blogsService.updateBlog(req.params.id, req.body)

        if (updatedBlog) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async deleteBlogById(req: Request, res: Response) {
        const foundedBlog = await this.blogsService.deleteBlog(req.params.id)

        if (!foundedBlog) {
            res.sendStatus(404)
        } else {
            res.sendStatus(204)
        }
    }
}

const blogsControllerInstance = new BlogsController()

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