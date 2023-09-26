import {Request, Response, Router} from "express";
export const postsRouter = Router({})
import {postsRepository} from "../repositories/posts-repository";
import {inputPostValidation} from "../middlewares/input-post-validation";
import {postModel} from "../models/post-model";

postsRouter.get('/', (req: Request, res: Response) => {
    const allPosts = postsRepository.getAllPosts()
    res.status(200).send(allPosts)
})

postsRouter.post('/', inputPostValidation, (req: Request, res: Response) => {
    const {title , shortDescription, content, blogId} = req.body
    const inputData = req.body.title

    const newPost = postsRepository.createPost(req.body)
    res.status(201).send(newPost)
})

postsRouter.get('/:id', (req: Request, res: Response) => {
    const foundPost = postsRepository.getByid(req.params.id)
    if(!foundPost) {
        res.sendStatus(404)
    } else {
        res.sendStatus(200)
    }
})

postsRouter.put('/:id', inputPostValidation, (req: Request, res: Response) => {
    const {title, shortDescription, content, blogId} = req.body
    const updatePost = postsRepository.updatePost(req.body)
    if(!updatePost) {
        res.status(404)
    } else {
        res.status(200)
    }

})

postsRouter.delete('/:id', (req: Request, res: Response) => {
    const successDel = postsRepository.deletePost(req.body.id)
    if(!successDel) {
        res.sendStatus(404)
    } else {
        res.sendStatus(200)
    }
})

postsRouter.delete('/testing/all-data', (req: Request, res: Response) => {
    const sucDel = postsRepository.deleteAll()
    if(sucDel) res.sendStatus(200)
})