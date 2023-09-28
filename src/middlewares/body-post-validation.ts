import {body} from "express-validator";
import {DB} from "../data/DB";

export const bodyPostValidation = {
    title:body('title').isString().trim().isLength({min: 1, max: 30}).withMessage({message: 'Incorrect title', field: 'title'}),
    shortDescription:body('shortDescription').isString().trim().isLength({min: 1, max: 100}).withMessage({message: 'Incorrect shortDescription', field: 'shortDescription'}),
    content:body('content').isString().trim().isLength({min: 1, max: 1000}).withMessage({message: 'Incorrect content', field: 'content'}),
    blogId:body('blogId').custom(value => {
        const blog = DB.blogs.find(p => p.id === value)

        if(!blog) throw new Error('invalid blogId')

        return true
    })
}