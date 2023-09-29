import {body} from "express-validator";

export const bodyBlogValidation = {
    name:body('name').isString().trim().isLength({max: 15}),
    description:body('description').isString().trim().isLength({max: 500}),
    websiteUrl:body('websiteUrl').isString().trim().isLength({max: 100}).matches('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)')
}
