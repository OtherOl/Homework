import {Request, Response, Router} from "express";
import {bodyBlogValidation} from "../middlewares/body-blog-validation";
import {blogsRepository} from "../repositories/blogs-db-repository";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorisationMiddleware} from "../middlewares/authorisation-middleware";

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    const allBlogs = await blogsRepository.getAllBlogs()
    res.status(200).send(allBlogs)
})

blogsRouter.post('/', authorisationMiddleware, bodyBlogValidation.name, bodyBlogValidation.description,
    bodyBlogValidation.websiteUrl, inputValidationMiddleware, async (req: Request, res: Response) => {
    const {name, description, websiteUrl} = req.body
    const newBlog = await blogsRepository.createBlog(req.body)

    res.status(201).send(newBlog)
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    let findBlog = await blogsRepository.getBlogById(req.params.id)

    if(!findBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).send(findBlog)
    }
})

blogsRouter.put('/:id', authorisationMiddleware, bodyBlogValidation.name, bodyBlogValidation.description, bodyBlogValidation.websiteUrl, inputValidationMiddleware,
    async (req: Request, res: Response) => {
    const {name, description, websiteUrl} = req.body

    const updatedBlog = await blogsRepository.updateBlog(req.params.id, req.body)

    if(updatedBlog) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

blogsRouter.delete('/:id', authorisationMiddleware, async (req: Request, res: Response) => {
    const foundedBlog = await blogsRepository.deleteBlog(req.params.id)

    if(!foundedBlog) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})