"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyUserValidation = void 0;
const express_validator_1 = require("express-validator");
exports.bodyUserValidation = {
    login: (0, express_validator_1.body)('login').isString().notEmpty().trim().isLength({ min: 3, max: 10 }).matches('^[a-zA-Z0-9_-]*$'),
    password: (0, express_validator_1.body)('password').isString().notEmpty().trim().isLength({ min: 6, max: 20 }),
    email: (0, express_validator_1.body)('email').isString().notEmpty().trim().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
};
