import {body} from "express-validator";
import {BlogModelClass} from "../data/DB-Mongo";

export const bodyPostValidation = {
    blogId: body('blogId').custom(async (value) => {
        const blogExists = await BlogModelClass.findOne({id: value})

        if (!blogExists) {
            throw new Error("Blog doesn't exists")
        } else {
            return true
        }
    }),
    title: body('title').isString().notEmpty().trim().isLength({min: 1, max: 30}),
    shortDescription: body('shortDescription').isString().notEmpty().trim().isLength({min: 1, max: 100}),
    content: body('content').isString().notEmpty().trim().isLength({min: 1, max: 1000}),
    comment: body('content').isString().notEmpty().trim().isLength({min: 20, max: 300}),
    likeStatus: body('likeStatus').custom(async (req) => {
        if(req === "Like") return true
        if(req === "Dislike") return true
        if(req === "None") return true
        throw new Error("Invalid value")
    })
}