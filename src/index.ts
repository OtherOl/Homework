import express, {Request, Response} from "express";
import bodyParser from "body-parser";

const app = express()
const port = 4000
app.use(express.json())

let videos = [{
    id: +(new Date()),
    title: "Homework",
    author: "Pilya",
    canBeDownloaded: true,
    createdAt: new Date(),
    publicationDate: new Date(),
    availableResolutions: ["P144"]
}]

app.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(videos)
})

app.post('/videos', (req: Request, res: Response) => {
    const quality = req.body.title
    if(!quality || typeof quality !== "string" || quality.length > 40 || !quality.trim()) {
        res.status(400).send({
            errorsMessages: [{
                message: 'Incorrect title',
                field: 'title'
            }]
        })
        return;
    }
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: 'Pilya',
        canBeDownloaded: true,
        createdAt: new Date(),
        publicationDate: new Date(),
        availableResolutions: ["P144"]
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
    let update = videos.find(p => p.id === +(req.params.id))
    if(update) {
        update.title = req.body.title
        res.status(204)
    } else if(!req.body.title || typeof req.body.title !== "string" || req.body.title.length > 40 || !req.body.title.trim()) {
        res.status(404).send({
            errorsMessages: [{
                message: 'Incorrect title',
                field: 'title'
            }]
        })} else {
        res.status(400)
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

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})