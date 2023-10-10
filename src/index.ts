import express, {Request, Response} from "express";
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {client, clientBlogCollection, clientPostCollection, clientUserCollection, runDb} from "./data/DB-Mongo";
import {blogModel} from "./models/blog-model";
import {PostDbModel,} from "./models/post-model";
import {usersRouter} from "./routers/users-router";

export const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, at this moment we will create our future!')
})

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    const resultBlog = await clientBlogCollection.deleteMany({})
    const resultPost = await clientPostCollection.deleteMany({})
    const resultUser = await clientUserCollection.deleteMany({})

    res.sendStatus(204)
})
app.use(express.json())
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()
