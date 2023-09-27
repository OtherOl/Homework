import {body} from "express-validator";

export const bodyBlogValidation = {
    name:body('name').isString().trim().isLength({min: 1, max: 15}).withMessage('Incorrect name'),
    description:body('description').isString().trim().isLength({min: 1, max: 500}).withMessage('Incorrect description'),
    websiteUrl:body('websiteUrl').isString().trim().isLength({min: 1, max: 100}).withMessage('Incorrect websiteUrl')
}
