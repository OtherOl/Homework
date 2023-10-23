"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyBlogValidation = void 0;
const express_validator_1 = require("express-validator");
exports.bodyBlogValidation = {
    name: (0, express_validator_1.body)('name').isString().notEmpty().trim().isLength({ min: 1, max: 15 }),
    description: (0, express_validator_1.body)('description').notEmpty().isString().trim().isLength({ min: 1, max: 500 }),
    websiteUrl: (0, express_validator_1.body)('websiteUrl').notEmpty().isString().trim().isLength({
        min: 1,
        max: 100
    }).matches('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)')
};
