import express, {Request, Response} from "express";
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {
    clientAuthCollection,
    clientBlogCollection,
    clientCommentCollection,
    clientPostCollection, clientSecurityCollection,
    clientUserCollection,
    runDb
} from "./data/DB-Mongo";
import {usersRouter} from "./routers/users-router";
import {authRouter} from "./routers/auth-router";
import {commentsRouter} from "./routers/comments-router";
import cookieParser from "cookie-parser";
import {securityRouter} from "./routers/security-router";

export const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.set('trust proxy', true)
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, at this moment we will create our future!')
})

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await clientBlogCollection.deleteMany({})
    await clientPostCollection.deleteMany({})
    await clientUserCollection.deleteMany({})
    await clientCommentCollection.deleteMany({})
    await clientAuthCollection.deleteMany({})
    await clientSecurityCollection.deleteMany({})

    res.sendStatus(204)
})
app.use(express.json())
app.use(cookieParser())
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/security', securityRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()
