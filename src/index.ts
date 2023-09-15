import express, {Request, Response} from "express";
import bodyParser from "body-parser";

const app = express()
const port = 4000

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    let helloWorld = "Hello, let's talk about our code?"
    res.send(helloWorld)
})

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})