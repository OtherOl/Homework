import {Request, Response, Router} from "express";


let videos = [{
    id: +(new Date()),
    title: "Homework",
    author: "Pilya",
    canBeDownloaded: true,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions:  ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
}]

export const videosRouter = Router()

videosRouter.get('/', (req: Request, res: Response) => {
    res.status(200)
})

videosRouter.post('/', (req: Request, res: Response) => {
    const quality = req.body.title
    const name = req.body.author
    if(!quality || typeof quality !== "string" || quality.length > 40 || !quality.trim()) {
        res.status(400).send({
            errorsMessages: [{
                message: 'Incorrect title',
                field: 'title'
            }]
        })
    } else if(!name || typeof name !== "string" || name.length > 20 || !name.trim()) {
        res.status(400).send({
            errorsMessages: [{
                message: 'Incorrect author',
                field: 'author'
            }]
        })
        return;
    }
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: 'Pilya',
        canBeDownloaded: true,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: ["P144"]
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
})

videosRouter.get('/:id', (req: Request, res: Response) => {
    let video = videos.find(p => p.id === +(req.params.id))
    if(video) {
        res.status(200)
    } else {
        res.status(404)
    }
})

videosRouter.put('/:id', (req: Request, res: Response) => {
    let update = videos.find(p => p.id === +(req.params.id))
    if(update) {
        if(!req.body.title || typeof req.body.title !== "string" || req.body.title.length > 40 || !req.body.title.trim()) {
            res.status(400).send({
                errorsMessages: [{
                    message: 'Incorrect title',
                    field: 'title'
                }]
            })} else if(!update){
            res.status(404)
        } else {
            update.title = req.body.title
            res.status(204)
        }
    }
})

videosRouter.delete('/:id', (req: Request, res: Response) => {
    for(let i = 0; i < videos.length; i++) {
        if(+(req.params.id) === videos[i].id) {
            videos.splice(i, 1)
            res.status(204)
        } else {
            res.status(404)
        }
    }
})

videosRouter.delete('/testing/all-data', (req: Request, res: Response) => {
    videos.splice(0)
    res.status(204)
})