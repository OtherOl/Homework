"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
exports.blogsRouter = (0, express_1.Router)({});
const body_blog_validation_1 = require("../middlewares/body-blog-validation");
const blogs_repository_1 = require("../repositories/blogs-repository");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const authorisation_middleware_1 = require("../middlewares/authorisation-middleware");
exports.blogsRouter.get('/', (req, res) => {
    const allBlogs = blogs_repository_1.blogsRepository.getAllblogs();
    res.status(200).send(allBlogs);
});
exports.blogsRouter.post('/', authorisation_middleware_1.authorisationMiddleware, body_blog_validation_1.bodyBlogValidation.name, body_blog_validation_1.bodyBlogValidation.description, body_blog_validation_1.bodyBlogValidation.websiteUrl, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const { name, description, websiteUrl } = req.body;
    const newBlog = blogs_repository_1.blogsRepository.createBlog(req.body);
    res.status(201).send(newBlog);
});
exports.blogsRouter.get('/:id', (req, res) => {
    let findBlog = blogs_repository_1.blogsRepository.getBlogById(req.params.id);
    if (!findBlog) {
        res.sendStatus(404);
    }
    else {
        res.status(200).send(findBlog);
    }
});
exports.blogsRouter.put('/:id', authorisation_middleware_1.authorisationMiddleware, body_blog_validation_1.bodyBlogValidation.name, body_blog_validation_1.bodyBlogValidation.description, body_blog_validation_1.bodyBlogValidation.websiteUrl, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const { id, name, description, websiteUrl } = req.body;
    let getBlogById = blogs_repository_1.blogsRepository.getBlogById(req.params.id);
    blogs_repository_1.blogsRepository.updateBlog(req.body);
    if (!getBlogById) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
});
exports.blogsRouter.delete('/:id', authorisation_middleware_1.authorisationMiddleware, (req, res) => {
    let foundedBlog = blogs_repository_1.blogsRepository.deleteBlog(req.params.id);
    if (!foundedBlog) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
});
exports.blogsRouter.delete('/testing/all-data');
