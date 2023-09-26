import {NextFunction, Request, Response} from "express";
import {body, Result, validationResult} from "express-validator";

export const inputPostValidation = (req: Request, res: Response, next: NextFunction) => {
    body('title').isString().trim().isLength({min: 1, max: 30}).withMessage({message: 'Incorrect title', field: 'title'})
    body('shortDescription').isString().trim().isLength({min: 1, max: 100}).withMessage({message: 'Incorrect shortDescription', field: 'shortDescription'})
    body('content').isString().trim().isLength({min: 1, max: 1000}).withMessage({message: 'Incorrect content', field: 'content'})
    body('blogId').isString().trim().isLength({max: 150}).withMessage({message: 'Incorrect blogId', field: 'blogId'})

    const errors: Result = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).json({errorsMessages: errors.array()})
    } else {
        next()
    }
}