"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const posts_repository_1 = require("../repositories/posts-repository");
const body_post_validation_1 = require("../middlewares/body-post-validation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => {
    const allPosts = posts_repository_1.postsRepository.getAllPosts();
    res.status(200).send(allPosts);
});
exports.postsRouter.post('/', body_post_validation_1.bodyPostValidation.title, body_post_validation_1.bodyPostValidation.shortDescription, body_post_validation_1.bodyPostValidation.content, body_post_validation_1.bodyPostValidation.blogId, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const { title, shortDescription, content, blogId } = req.body;
    const newPost = posts_repository_1.postsRepository.createPost(req.body);
    res.status(201).send(newPost);
});
exports.postsRouter.get('/:id', (req, res) => {
    const foundPost = posts_repository_1.postsRepository.getPostById(req.params.id);
    if (!foundPost) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(200);
    }
});
exports.postsRouter.put('/:id', body_post_validation_1.bodyPostValidation.title, body_post_validation_1.bodyPostValidation.shortDescription, body_post_validation_1.bodyPostValidation.content, body_post_validation_1.bodyPostValidation.blogId, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const { title, shortDescription, content, blogId } = req.body;
    const getPostById = posts_repository_1.postsRepository.getPostById(req.params.id);
    posts_repository_1.postsRepository.updatePost(req.body);
    if (!getPostById) {
        res.status(404);
    }
    else {
        res.status(204);
    }
});
exports.postsRouter.delete('/:id', (req, res) => {
    const successDel = posts_repository_1.postsRepository.deletePost(req.params.id);
    if (!successDel) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
});
