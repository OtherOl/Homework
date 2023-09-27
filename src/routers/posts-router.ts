import {NextFunction, Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {bodyPostValidation} from "../middlewares/body-post-validation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response) => {
    const allPosts = postsRepository.getAllPosts()
    res.status(200).send(allPosts)
})

postsRouter.post('/', bodyPostValidation.title, bodyPostValidation.shortDescription, bodyPostValidation.content,
    bodyPostValidation.blogId, inputValidationMiddleware, (req: Request, res: Response, next: NextFunction) => {
    const {title, shortDescription, content, blogId} = req.body

    const newPost = postsRepository.createPost(req.body)
    res.status(201).send(newPost)
})

postsRouter.get('/:id', (req: Request, res: Response) => {
    const foundPost = postsRepository.getPostById(req.params.id)
    if (!foundPost) {
        res.sendStatus(404)
    } else {
        res.sendStatus(200)
    }
})

postsRouter.put('/:id', bodyPostValidation.title, bodyPostValidation.shortDescription, bodyPostValidation.content,
    bodyPostValidation.blogId, inputValidationMiddleware, (req: Request, res: Response) => {
    const {title, shortDescription, content, blogId} = req.body

    let getPostById = postsRepository.getPostById(req.params.id)
    postsRepository.updatePost(req.body)

    if (!getPostById) {
        res.status(404)
    } else {
        res.status(200)
    }

})

postsRouter.delete('/:id', (req: Request, res: Response) => {
    const successDel = postsRepository.deletePost(req.params.id)

    if (!successDel) {
        res.sendStatus(404)
    } else {
        res.sendStatus(204)
    }
})

postsRouter.delete('/testing/all-data', (req: Request, res: Response) => {
    const sucDel = postsRepository.deleteAll()
    if (sucDel) res.sendStatus(204)
})