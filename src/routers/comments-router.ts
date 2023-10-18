import {Router, Request, Response} from "express";
import {commentsService} from "../domain/comments-service";

export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const comment = await commentsService.getCommentById(req.params.id)

    if (!comment) {
        res.sendStatus(404)
    } else {
        res.status(200).send(comment)
    }
})

commentsRouter.put('/:id', async (req: Request, res: Response) => {

})