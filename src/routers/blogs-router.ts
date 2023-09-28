import {Request, Response, Router} from "express";
export const blogsRouter = Router({})
import {bodyBlogValidation} from "../middlewares/body-blog-validation";
import {blogsRepository} from "../repositories/blogs-repository";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorisationMiddleware} from "../middlewares/authorisation-middleware";



blogsRouter.get('/', (req: Request, res: Response) => {
    const allBlogs = blogsRepository.getAllblogs()
    res.status(200).send(allBlogs)
})

blogsRouter.post('/', bodyBlogValidation.name, bodyBlogValidation.description, bodyBlogValidation.websiteUrl, inputValidationMiddleware, (req: Request, res: Response) => {
    const {name, description, websiteUrl} = req.body
    const newBlog = blogsRepository.createBlog(req.body)

    res.status(201).send(newBlog)
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
    let findBlog = blogsRepository.getBlogById(req.params.id)

    if(!findBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).send(findBlog)
    }
})

blogsRouter.put('/:id', bodyBlogValidation.name, bodyBlogValidation.description, bodyBlogValidation.websiteUrl, inputValidationMiddleware, (req: Request, res: Response) => {
    const {id, name, description, websiteUrl} = req.body

    let getBlogById = blogsRepository.getBlogById(req.params.id)
    blogsRepository.updateBlog(req.body)

    if(!getBlogById) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})

blogsRouter.delete('/:id', (req: Request, res: Response) => {
    let foundedBlog = blogsRepository.deleteBlog(req.params.id)

    if(!foundedBlog) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})

blogsRouter.delete('/testing/all-data',)