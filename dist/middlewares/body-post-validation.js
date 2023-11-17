"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyPostValidation = void 0;
const express_validator_1 = require("express-validator");
const DB_Mongo_1 = require("../data/DB-Mongo");
exports.bodyPostValidation = {
    blogId: (0, express_validator_1.body)('blogId').custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const blogExists = yield DB_Mongo_1.BlogModelClass.findOne({ id: value });
        if (!blogExists) {
            throw new Error("Blog doesn't exists");
        }
        else {
            return true;
        }
    })),
    title: (0, express_validator_1.body)('title').isString().notEmpty().trim().isLength({ min: 1, max: 30 }),
    shortDescription: (0, express_validator_1.body)('shortDescription').isString().notEmpty().trim().isLength({ min: 1, max: 100 }),
    content: (0, express_validator_1.body)('content').isString().notEmpty().trim().isLength({ min: 1, max: 1000 }),
    comment: (0, express_validator_1.body)('content').isString().notEmpty().trim().isLength({ min: 20, max: 300 })
};
