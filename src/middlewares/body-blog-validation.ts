import {body} from "express-validator";

export const bodyBlogValidation = {
    name: body('name').isString().notEmpty().trim().isLength({min: 1, max: 15}),
    description: body('description').notEmpty().isString().trim().isLength({min: 1, max: 500}),
    websiteUrl: body('websiteUrl').notEmpty().isString().trim().isLength({
        min: 1,
        max: 100
    }).matches('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)')
}
