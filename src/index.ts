import express, {Request, Response} from "express";
import bodyParser from "body-parser";
const date1 = new Date()
let videos = [{
    id: Number(date1),
    title: "Homework",
    author: "Pilya",
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions:  ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
}]
// new Date((date1.setDate(date1.getDate() + 1))).toISOString()
const app = express()
const port = 4000
app.use(express.json())

app.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(videos)
})

app.post('/videos', (req: Request, res: Response) => {
    const quality = req.body.title
    const name = req.body.author
    let errors: any = {
        errorsMessages: []
    }
    if(!name || typeof name !== "string" || name.length > 20 || !name.trim()) {
        // res.status(400).send({
        //     errorsMessages: [{
        //         message: 'Incorrect author',
        //         field: 'author'
        //     }]
        // })
        errors.errorsMessages.push({
            message: 'Incorrect author',
            field: 'author'
        })
    }
    if(!quality || typeof quality !== "string" || quality.length > 40 || !quality.trim()) {
        // res.status(400).send({
        //     errorsMessages: [{
        //         message: 'Incorrect title',
        //         field: 'title'
        //     }]
        // })
        errors.errorsMessages.push({
            message: 'Incorrect title',
            field: 'title'
        })
    }
    if(errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }

    const date = new Date()

    const newVideo = {
        id: Number(date),
        title: req.body.title,
        author: req.body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: date.toISOString(),
        publicationDate: new Date((date.setDate(date.getDate() + 1))).toISOString(),
        availableResolutions: req.body.availableResolutions,
    }
        videos.push(newVideo)
    res.status(201).send(newVideo)
})

app.get('/videos/:id', (req: Request, res: Response) => {
    let video = videos.find(p => p.id === +(req.params.id))
    if(video) {
        res.status(200)
    } else {
        res.status(404)
    }
})

app.put('/videos/:id', (req: Request, res: Response) => {
    let errors: any = {
        errorsMessages: []
    }
    if(!req.body.title || typeof req.body.title !== "string" || req.body.title.length > 40 || !req.body.title.trim()) {
        // res.status(400).send({
        //     errorsMessages: [{
        //         message: 'Incorrect title',
        //         field: 'title'
        //     }]
        // })
        errors.errorsMessages.push({
            message: 'Incorrect title',
            field: 'title'
        })
    }
    if(typeof req.body.canBeDownloaded !== 'boolean') {
        // res.status(400).send({
        //     errorsMessages: [{
        //         message: 'Incorrect canBeDownloaded',
        //         field: 'canBeDownloaded'
        //     }]
        // })
        errors.errorsMessages.push({
            message: 'Incorrect canBeDownloaded',
            field: 'canBeDownloaded'
        })
    }
    if(errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }

    const id = +req.params.id
    const video = videos.find(p => p.id === id)
    if(video) {
        video.title = req.body.title
        res.status(204).send(video)
    } else {
        res.send(404)
    }
})

app.delete('/videos/:id', (req: Request, res: Response) => {
    for(let i = 0; i < videos.length; i++) {
        if(+(req.params.id) === videos[i].id) {
            videos.splice(i, 1)
            res.status(204)
        } else {
            res.status(404)
        }
    }
})

app.delete('/videos/testing/all-data', (req: Request, res: Response) => {
    videos.splice(0)
    res.status(204)
})

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})