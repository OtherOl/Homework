import {body} from "express-validator";
import {DB} from "../data/DB";

export const bodyPostValidation = {
    title:body('title').isString().notEmpty().trim().isLength({min: 1, max: 30}),
    shortDescription:body('shortDescription').isString().notEmpty().trim().isLength({min: 1, max: 100}),
    content:body('content').isString().notEmpty().trim().isLength({min: 1, max: 1000}),
    blogId:body('blogId').custom(value => {
        const blog = DB.blogs.find(p => p.id === value)

        if(!blog) throw new Error('invalid blogId')

        return true
    })
}