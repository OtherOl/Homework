import express, {Request, Response} from "express";
import {DB} from "./data/DB";
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
export const app = express()
app.use(express.json())
const port = 3000

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, at this moment we will create our future!')
})

app.delete('/testing/all-data', (req: Request, res: Response) => {
    DB.posts = []
    DB.blogs = []
    console.log('delete', DB)
    res.sendStatus(204)
})
app.use(express.json())
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})