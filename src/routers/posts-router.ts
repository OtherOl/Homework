import {Request, Response, Router} from "express";
import {errTitle, errPostDesc, errContent, errBlogId} from "../models/posts-errors-model";
export const postsRouter = Router({})
import {postsRepository} from "../repositories/posts-repository";

postsRouter.get('/', (req: Request, res: Response) => {
    // res.status(200).send(posts)
    const allPosts = postsRepository.getAllPosts()
    res.status(200).send(allPosts)
})

postsRouter.post('/', (req: Request, res: Response) => {
    const title = req.body.title
    const description = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId

    const newPost = postsRepository.createPost(title, description, content, blogId)
    res.status(201).send(newPost)
    // let errors: any = {
    //     errorsMessages: []
    // }
    //
    // if(!title || !title.trim() || typeof title !== "string" || title.length > 30) {
    //     errors.push(errTitle)
    // }
    //
    // if(!description || !description.trim() || typeof description !== "string" || description.length > 100) {
    //     errors.push(errPostDesc)
    // }
    //
    // if(!content || !content.trim() || typeof content !== "string" || content.length > 1000) {
    //     errors.push(errContent)
    // }
    //
    // if(!blogId || !blogId.trim() || typeof blogId !== "string") {
    //     errors.push(errBlogId)
    // }
    //
    // if(errors.errorsMessages.length) {
    //     res.status(400).send(errors)
    //     return
    // }
    //
    // const newPost = {
    //     id: `${title}-${blogId}`,
    //     title: title,
    //     shortDescription: description,
    //     content: content,
    //     blogId: blogId,
    //     blogName: `blog.${title}`
    // }
    //
    // posts.push(newPost)
    // res.status(201).send(newPost)
})

postsRouter.get('/:id', (req: Request, res: Response) => {
    const foundPost = postsRepository.getByid(req.params.id)
    if(!foundPost) {
        res.sendStatus(404)
    } else {
        res.sendStatus(200)
    }
})

postsRouter.put('/:id', (req: Request, res: Response) => {
    const title = req.body.title
    const description = req.body.shortDescription
    const content = req.body.content
    const blogId = req.body.blogId

    let foundPost = posts.find(p => p.id === req.params.id)

    let errors: any = {
        errorsMessages: []
    }

    if(!title || !title.trim() || typeof title !== "string" || title.length > 30) {
        errors.push(errTitle)
    }

    if(!description || !description.trim() || typeof description !== "string" || description.length > 100) {
        errors.push(errPostDesc)
    }

    if(!content || !content.trim() || typeof content !== "string" || content.length > 1000) {
        errors.push(errContent)
    }

    if(typeof blogId !== "string") {
        errors.push(errBlogId)
    }

    if(errors.errorsMessages.length) {
        res.status(400).send(errors)
    }

    if(!foundPost) {
        res.sendStatus(404)
    } else {
        foundPost.title = title
        foundPost.shortDescription = description
        foundPost.content = content
        foundPost.blogId = blogId
        res.sendStatus(204)
    }
})

postsRouter.delete('/:id', (req: Request, res: Response) => {
    const findPost = posts.find(p => p.id === req.params.id)
    if(!findPost) res.sendStatus(404)

    posts = posts.filter(p => p.id !== findPost?.id)
    return res.sendStatus(204)
})

postsRouter.delete('/testing/all-data', (req: Request, res: Response) => {
    posts = []
    res.sendStatus(204)
})