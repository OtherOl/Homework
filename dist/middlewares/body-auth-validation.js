"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyAuthValidation = void 0;
const express_validator_1 = require("express-validator");
exports.bodyAuthValidation = {
    loginOrEmail: (0, express_validator_1.body)('loginOrEmail').isString().notEmpty().trim(),
    password: (0, express_validator_1.body)('password').isString().notEmpty().trim()
};
