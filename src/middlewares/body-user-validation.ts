import {body} from "express-validator";

export const bodyUserValidation = {
    login: body('login').isString().notEmpty().trim().isLength({min: 3, max: 10}).matches('^[a-zA-Z0-9_-]*$'),
    password:body('password').isString().notEmpty().trim().isLength({min: 6, max: 20}),
    email:body('email').isString().notEmpty().trim().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
}