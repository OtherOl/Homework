import {app} from "./settings";
import {Request, Response} from "express";
import {DB} from "./data/DB";

const port = 3000

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, at this moment we will create our future!')
})

app.delete('/testing/all-data', (req: Request, res: Response) => {
    DB.posts = []
    DB.blogs = []
    res.sendStatus(204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})