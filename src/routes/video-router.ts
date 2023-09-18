import {Request, Response, Router} from "express";
export const videosRouter = Router({})

enum AvailableResolutionsEnum {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160'
}

export let videos = [{
    id: 1,
    title: "",
    author: "",
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: new Date().toISOString(),
    publicationDate: new Date().toISOString(),
    availableResolutions: AvailableResolutionsEnum
}]

videosRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(videos)
})

videosRouter.post('/', (req: Request, res: Response) => {
    const quality = req.body.title
    const name = req.body.author
    const availableResolutions = req.body.availableResolutions

    let errors: any = {
        errorsMessages: []
    }

    if (!name || typeof name !== "string" || name.length > 20 || !name.trim()) {
        errors.errorsMessages.push({
            message: 'Incorrect author',
            field: 'author'
        })
    }

    if (!quality || typeof quality !== "string" || quality.length > 40 || !quality.trim()) {
        errors.errorsMessages.push({
            message: 'Incorrect title',
            field: 'title'
        })
    }

    if (!availableResolutions || !Array.isArray(availableResolutions) || !availableResolutions.every(e => Object.values(AvailableResolutionsEnum).includes(e))) {
        errors.errorsMessages.push({
            message: 'Incorrect availableResolutions',
            field: 'availableResolutions'
        })
    }

    if (errors.errorsMessages.length) {
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

videosRouter.get('/:id', (req: Request, res: Response) => {
    let video = videos.find(p => p.id === +(req.params.id))

    if (video) {
        res.status(200).send(video)
    } else {
        res.sendStatus(404)
    }
})

videosRouter.put('/:id', (req: Request, res: Response) => {
    let errors: any = {
        errorsMessages: []
    }

    const resolutions = req.body.availableResolutions

    if (!req.body.title || typeof req.body.title !== "string" || req.body.title.length > 40 || !req.body.title.trim()) {
        errors.errorsMessages.push({
            message: 'Incorrect title',
            field: 'title'
        })
    }

    if (!req.body.author || typeof req.body.author !== "string" || req.body.author.length > 20 || !req.body.author.trim()) {
        errors.errorsMessages.push({
            message: 'Incorrect author',
            field: 'author'
        })
    }

    if (typeof req.body.canBeDownloaded !== 'boolean') {
        errors.errorsMessages.push({
            message: 'Incorrect canBeDownloaded',
            field: 'canBeDownloaded'
        })
    }

    if (typeof req.body.minAgeRestriction !== "number" || req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1) { // number || 1 <= mAR <= 18
        errors.errorsMessages.push({
            message: 'Incorrect minAgeRestriction',
            field: 'minAgeRestriction'
        })
    }

    if (req.body.publicationDate < new Date()) {
        errors.errorsMessages.push({
            message: 'Incorrect publicationDate',
            field: 'publicationDate'
        })
    }

    if (!resolutions || !Array.isArray(resolutions) || !resolutions.every(e => Object.values(AvailableResolutionsEnum).includes(e))) {
        errors.errorsMessages.push({
            message: 'Incorrect availableResolutions',
            field: 'availableResolutions'
        })
    }

    if (errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }

    const id = +req.params.id
    const video = videos.find(p => p.id === id)

    if (video) {
        video.title = req.body.title
        video.canBeDownloaded = req.body.canBeDownloaded
        video.minAgeRestriction = req.body.minAgeRestriction
        video.author = req.body.author
        video.availableResolutions = req.body.availableResolutions
        video.publicationDate = req.body.publicationDate
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

videosRouter.delete('/:id', (req: Request, res: Response) => {
    const video = videos.find(v => v.id === +req.params.id)

    if(!video) return res.sendStatus(404)

    videos = videos.filter(v => v.id !== video.id)
    return res.sendStatus(204)
})

videosRouter.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = []
    return res.sendStatus(204)
})