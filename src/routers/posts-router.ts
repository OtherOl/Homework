import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-db-repository";
import {bodyPostValidation} from "../middlewares/body-post-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authorisationMiddleware} from "../middlewares/authorisation-middleware";

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    const allPosts = await postsRepository.getAllPosts()
    res.status(200).send(allPosts)
})

postsRouter.post('/', authorisationMiddleware, bodyPostValidation.blogId, bodyPostValidation.title, bodyPostValidation.shortDescription,
    bodyPostValidation.content, inputValidationMiddleware, async (req: Request, res: Response) => {
    const {title, shortDescription, content, blogId} = req.body

    const newPost = await postsRepository.createPost(req.body)
    res.status(201).send(newPost)
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const foundPost = await postsRepository.getPostById(req.params.id)
    if (!foundPost) {
        res.sendStatus(404)
    } else {
        res.status(200).send(foundPost)
    }
})

postsRouter.put('/:id', authorisationMiddleware, bodyPostValidation.title, bodyPostValidation.shortDescription, bodyPostValidation.content,
    bodyPostValidation.blogId, inputValidationMiddleware, async (req: Request, res: Response) => {
    const {title, shortDescription, content, blogId} = req.body

    const updatedPost = await postsRepository.updatePost(req.params.id, req.body)

    if (updatedPost) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }

})

postsRouter.delete('/:id', authorisationMiddleware, async (req: Request, res: Response) => {
    const successDel = await postsRepository.deletePost(req.params.id)

    if (!successDel) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})
