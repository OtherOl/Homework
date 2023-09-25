import {Request, Response, Router} from "express";
import {errName, errDescription, errWebsiteUrl, errId} from "../models/blogs-errors-model";
export const blogsRouter = Router({})

let blogs = [{
    id: "12345",
    name: "a little bit",
    description: "shortcut",
    websiteUrl: "https://asda"
}]

blogsRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(blogs)
})

blogsRouter.post('/', (req: Request, res: Response) => {
    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl

    let errors: any = {
        errorsMessages: []
    }

    if(!name || !name.trim() || name.length > 15 || typeof name !== "string") {
        errors.push(errName)
    }

    if(!description || !description.trim() || description.length > 500 || typeof description !== "string") {
        errors.push(errDescription)
    }

    if(!websiteUrl || !websiteUrl.trim() || websiteUrl.length > 100 || typeof websiteUrl !== "string") {  //should validate pattern ( starts.with('https://" )
        errors.push(errWebsiteUrl)
    }

    if(errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }

    const newBlog = {
        id: `${name}1`,
        name: name,
        description: description,
        websiteUrl: websiteUrl
    }

    blogs.push(newBlog)
    res.status(201).send(newBlog)
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
    let findBlog = blogs.find(p => p.id === req.params.id)

    if(!findBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).send(findBlog)
    }
})

blogsRouter.put('/:id', (req: Request, res: Response) => {
    let foundBlog = blogs.find(p => p.id === req.params.id)

    const name = req.body.name
    const description = req.body.description
    const websiteUrl = req.body.websiteUrl

    let errors: any = {
        errorsMessages: []
    }

    if(!name || !name.trim() || typeof name !== "string" || name.length > 15) {
        errors.errorsMessages.push(errName)
    }

    if(!description || !description.trim() || typeof description !== "string" || description.length > 500) {
        errors.errorsMessages.push(errDescription)
    }

    if(!websiteUrl || !websiteUrl.trim() || typeof websiteUrl !== "string" || websiteUrl.length > 100) { //validate pattern!! starts.with('https://" )
        errors.errorsMessages.push(errWebsiteUrl)
    }

    if(errors.errorsMessages.length) {
        res.status(400).send(errors)
    }

    if(!foundBlog) {
        res.sendStatus(404)
    } else {
        foundBlog.name = name
        foundBlog.description = description
        foundBlog.websiteUrl = websiteUrl
        res.sendStatus(204)
    }
})

blogsRouter.delete('/:id', (req: Request, res: Response) => {
    const foundBlog = blogs.find(p => p.id === req.params.id)

    if(!foundBlog) res.sendStatus(404)

    blogs = blogs.filter(p => p.id !== foundBlog?.id)
    return res.sendStatus(204)
})

blogsRouter.delete('/testing/all-data', (req: Request, res: Response) => {
    blogs = []
    res.sendStatus(204)
})