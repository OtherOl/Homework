"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const posts_repository_1 = require("../repositories/posts-repository");
const body_post_validation_1 = require("../middlewares/body-post-validation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const authorisation_middleware_1 = require("../middlewares/authorisation-middleware");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => {
    const allPosts = posts_repository_1.postsRepository.getAllPosts();
    res.status(200).send(allPosts);
});
exports.postsRouter.post('/', authorisation_middleware_1.authorisationMiddleware, body_post_validation_1.bodyPostValidation.title, body_post_validation_1.bodyPostValidation.shortDescription, body_post_validation_1.bodyPostValidation.content, body_post_validation_1.bodyPostValidation.blogId, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
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
        res.status(200).send(foundPost);
    }
});
exports.postsRouter.put('/:id', authorisation_middleware_1.authorisationMiddleware, body_post_validation_1.bodyPostValidation.title, body_post_validation_1.bodyPostValidation.shortDescription, body_post_validation_1.bodyPostValidation.content, body_post_validation_1.bodyPostValidation.blogId, input_validation_middleware_1.inputValidationMiddleware, (req, res) => {
    const { title, shortDescription, content, blogId } = req.body;
    const updatedPost = posts_repository_1.postsRepository.updatePost(req.params.id, req.body);
    if (updatedPost) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.postsRouter.delete('/:id', authorisation_middleware_1.authorisationMiddleware, (req, res) => {
    const successDel = posts_repository_1.postsRepository.deletePost(req.params.id);
    if (!successDel) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
});
