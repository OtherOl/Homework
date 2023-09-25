import {app} from "./settings";
import {Request, Response} from "express";

const port = 3000

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, at this moment we will create our future!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})