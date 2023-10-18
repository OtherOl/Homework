import {body} from "express-validator";

export const bodyAuthValidation = {
    loginOrEmail: body('loginOrEmail').isString().notEmpty().trim(),
    password: body('password').isString().notEmpty().trim()
}