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
exports.blogsRouter = void 0;
const express_1 = require("express");
const body_blog_validation_1 = require("../middlewares/body-blog-validation");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const authorisation_middleware_1 = require("../middlewares/authorisation-middleware");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allBlogs = yield blogs_db_repository_1.blogsRepository.getAllBlogs();
    res.status(200).send(allBlogs);
}));
exports.blogsRouter.post('/', authorisation_middleware_1.authorisationMiddleware, body_blog_validation_1.bodyBlogValidation.name, body_blog_validation_1.bodyBlogValidation.description, body_blog_validation_1.bodyBlogValidation.websiteUrl, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, websiteUrl } = req.body;
    const newBlog = yield blogs_db_repository_1.blogsRepository.createBlog(req.body);
    res.status(201).send(newBlog);
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let findBlog = yield blogs_db_repository_1.blogsRepository.getBlogById(req.params.id);
    if (!findBlog) {
        res.sendStatus(404);
    }
    else {
        res.status(200).send(findBlog);
    }
}));
exports.blogsRouter.put('/:id', authorisation_middleware_1.authorisationMiddleware, body_blog_validation_1.bodyBlogValidation.name, body_blog_validation_1.bodyBlogValidation.description, body_blog_validation_1.bodyBlogValidation.websiteUrl, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, websiteUrl } = req.body;
    const updatedBlog = yield blogs_db_repository_1.blogsRepository.updateBlog(req.params.id, req.body);
    if (updatedBlog) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.blogsRouter.delete('/:id', authorisation_middleware_1.authorisationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundedBlog = yield blogs_db_repository_1.blogsRepository.deleteBlog(req.params.id);
    if (!foundedBlog) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
}));
