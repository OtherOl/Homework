import {body} from "express-validator";
import {client} from "../data/DB-Mongo";
import {blogModel} from "../models/blog-model";

export const bodyPostValidation = {
    blogId:body('blogId').custom(async (value) => {
        const blogExists = await client.db('blogs_posts').collection<blogModel>('blogs').findOne({id: value})

        if(!blogExists) {
            throw new Error("Blog doesn't exists")
        } else {
            return true
        }
    }),
    title:body('title').isString().notEmpty().trim().isLength({min: 1, max: 30}),
    shortDescription:body('shortDescription').isString().notEmpty().trim().isLength({min: 1, max: 100}),
    content:body('content').isString().notEmpty().trim().isLength({min: 1, max: 1000})
}