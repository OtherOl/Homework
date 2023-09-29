import {body} from "express-validator";
import {DB} from "../data/DB";

export const bodyPostValidation = {
    title:body('title').isString().trim().isLength({max: 30}),
    shortDescription:body('shortDescription').isString().trim().isLength({max: 100}),
    content:body('content').isString().trim().isLength({max: 1000}),
    blogId:body('blogId').custom(value => {
        const blog = DB.blogs.find(p => p.id === value)

        if(!blog) throw new Error('invalid blogId')

        return true
    })
}