import {Request, Response, Router} from "express";
import {bodyBlogValidation} from "../middlewares/body-blog-validation";
import {blogsService} from "../domain/blogs-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorisationMiddleware} from "../middlewares/authorisation-middleware";
import {bodyPostValidation} from "../middlewares/body-post-validation";
import {postsService} from "../domain/posts-service";

export const blogsRouter = Router({})

interface generic {
    searchNameTerm: string,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number
}

blogsRouter.get('/', async (req: Request<{}, {}, {}, generic>, res: Response) => {
    const allBlogs = await blogsService.getAllBlogs(
        req.query.searchNameTerm, req.query.sortBy,
        req.query.sortDirection, req.query.pageNumber ? +req.query.pageNumber : 1,
        req.query.pageSize ? +req.query.pageSize : 10
    )
    res.status(200).send(allBlogs)
})

blogsRouter.post('/', authorisationMiddleware, bodyBlogValidation.name, bodyBlogValidation.description,
    bodyBlogValidation.websiteUrl, inputValidationMiddleware, async (req: Request, res: Response) => {
        const {name, description, websiteUrl} = req.body
        const newBlog = await blogsService.createBlog(req.body)

        res.status(201).send(newBlog)
    })

blogsRouter.get('/:blogId/posts', async (req: Request<{ blogId: string }, {}, {}, generic>, res: Response) => {
    const foundPost = await blogsService.getPostByBlogId(
        req.params.blogId, req.query.sortBy,
        req.query.sortDirection, req.query.pageNumber ? +req.query.pageNumber : 1,
        req.query.pageSize ? +req.query.pageSize : 10
    )

    if (foundPost === false) {
        res.sendStatus(404)
    } else {
        res.status(200).send(foundPost)
    }
})

blogsRouter.post('/:blogId/posts', authorisationMiddleware, bodyPostValidation.title, bodyPostValidation.shortDescription,
    bodyPostValidation.content, inputValidationMiddleware, async (req: Request, res: Response) => {
    const blogId = req.params.blogId
        const {title, shortDescription, content} = req.body

        const newPost = await postsService.createPost({blogId, content, title, shortDescription})

        if(!newPost) {
            res.sendStatus(404)
        } else {
            res.status(201).send(newPost)
        }
    })

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    let findBlog = await blogsService.getBlogById(req.params.id)

    if (!findBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).send(findBlog)
    }
})

blogsRouter.put('/:id', authorisationMiddleware, bodyBlogValidation.name, bodyBlogValidation.description, bodyBlogValidation.websiteUrl, inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const {name, description, websiteUrl} = req.body

        const updatedBlog = await blogsService.updateBlog(req.params.id, req.body)

        if (updatedBlog) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

blogsRouter.delete('/:id', authorisationMiddleware, async (req: Request, res: Response) => {
    const foundedBlog = await blogsService.deleteBlog(req.params.id)

    if (!foundedBlog) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})