import express, {Request, Response} from "express";
import {DB} from "./data/DB";
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {client, runDb} from "./data/DB-Mongo";
import {blogModel} from "./models/blog-model";
import {postModel} from "./models/post-model";

export const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, at this moment we will create our future!')
})

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    const resultBlog = await client.db('blogs_posts').collection<blogModel>('blogs').deleteMany({})
    const resultPost = await client.db('blogs_posts').collection<postModel>('posts').deleteMany({})

    res.sendStatus(204)
})
app.use(express.json())
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()
