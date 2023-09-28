"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyBlogValidation = void 0;
const express_validator_1 = require("express-validator");
exports.bodyBlogValidation = {
    name: (0, express_validator_1.body)('name').isString().trim().isLength({ min: 1, max: 15 }).withMessage('Incorrect name'),
    description: (0, express_validator_1.body)('description').isString().trim().isLength({ min: 1, max: 500 }).withMessage('Incorrect description'),
    websiteUrl: (0, express_validator_1.body)('websiteUrl').isString().trim().isLength({ min: 1, max: 100 }).matches()
};
