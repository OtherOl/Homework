import {Request, Response, Router} from "express";
import {bodyBlogValidation} from "../middlewares/body-blog-validation";
import {blogsService} from "../domain/blogs-service";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorisationMiddleware} from "../middlewares/authorisation-middleware";

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    const allBlogs = await blogsService.getAllBlogs(
        req.body.searchNameTerm, req.body.sortBy,
        req.body.sortDirection, req.body.pageNumber,
        req.body.pageSize
        )
    res.status(200).send(allBlogs)
})

blogsRouter.post('/', authorisationMiddleware, bodyBlogValidation.name, bodyBlogValidation.description,
    bodyBlogValidation.websiteUrl, inputValidationMiddleware, async (req: Request, res: Response) => {
    const {name, description, websiteUrl} = req.body
    const newBlog = await blogsService.createBlog(req.body)

    res.status(201).send(newBlog)
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    let findBlog = await blogsService.getBlogById(req.params.id)

    if(!findBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).send(findBlog)
    }
})

blogsRouter.get('/:blogId/posts', async (req: Request, res: Response) => {
    const foundPost = blogsService.getPostByBlogId(req.body.blogId)

    if(!foundPost) {
        return res.sendStatus(404)
    } else {
        return res.status(200).send(foundPost)
    }
})

blogsRouter.put('/:id', authorisationMiddleware, bodyBlogValidation.name, bodyBlogValidation.description, bodyBlogValidation.websiteUrl, inputValidationMiddleware,
    async (req: Request, res: Response) => {
    const {name, description, websiteUrl} = req.body

    const updatedBlog = await blogsService.updateBlog(req.params.id, req.body)

    if(updatedBlog) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.delete('/:id', authorisationMiddleware, async (req: Request, res: Response) => {
    const foundedBlog = await blogsService.deleteBlog(req.params.id)

    if(!foundedBlog) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})