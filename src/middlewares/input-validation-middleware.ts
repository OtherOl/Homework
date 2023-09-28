import {validationResult} from "express-validator";
import {Request, Response, NextFunction} from "express";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        //@ts-ignore
        res.status(400).json({errorsMessages: errors.array({onlyFirstError: true}).map(err => ({message: err.msg, field:err!.path}))})
    } else {
        next()
    }
}

