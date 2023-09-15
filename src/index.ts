import express from "express";
import bodyParser from "body-parser";
import {videosRouter} from "./routes/videos-router";


const app = express()
const port = 4000
app.use(express.json())

const parserMiddleware = bodyParser({})
app.use(parserMiddleware)

app.use('/videos', videosRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})