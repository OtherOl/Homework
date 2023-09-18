import express, {Request, Response} from "express";
import {videos, videosRouter} from "./routes/video-router";

export const app = express()

app.use(express.json())
app.use('/videos', videosRouter)

