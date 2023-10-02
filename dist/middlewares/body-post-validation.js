"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyPostValidation = void 0;
const express_validator_1 = require("express-validator");
const DB_1 = require("../data/DB");
exports.bodyPostValidation = {
    title: (0, express_validator_1.body)('title').isString().notEmpty().trim().isLength({ min: 1, max: 30 }),
    shortDescription: (0, express_validator_1.body)('shortDescription').isString().notEmpty().trim().isLength({ min: 1, max: 100 }),
    content: (0, express_validator_1.body)('content').isString().notEmpty().trim().isLength({ min: 1, max: 1000 }),
    blogId: (0, express_validator_1.body)('blogId').custom(value => {
        const blog = DB_1.DB.blogs.find(p => p.id === value);
        if (!blog)
            throw new Error('invalid blogId');
        return true;
    })
};
