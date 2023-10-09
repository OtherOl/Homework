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
exports.postsRouter = void 0;
const express_1 = require("express");
const body_post_validation_1 = require("../middlewares/body-post-validation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const authorisation_middleware_1 = require("../middlewares/authorisation-middleware");
const posts_service_1 = require("../domain/posts-service");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allPosts = yield posts_service_1.postsService.getAllPosts(+req.params.pageNumber, +req.params.pageSize, req.params.sortBy, req.params.sortDirection);
    res.status(200).send(allPosts);
}));
exports.postsRouter.post('/', authorisation_middleware_1.authorisationMiddleware, body_post_validation_1.bodyPostValidation.blogId, body_post_validation_1.bodyPostValidation.title, body_post_validation_1.bodyPostValidation.shortDescription, body_post_validation_1.bodyPostValidation.content, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, shortDescription, content, blogId } = req.body;
    const newPost = yield posts_service_1.postsService.createPost(req.body);
    res.status(201).send(newPost);
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPost = yield posts_service_1.postsService.getPostById(req.params.id);
    if (!foundPost) {
        res.sendStatus(404);
    }
    else {
        res.status(200).send(foundPost);
    }
}));
exports.postsRouter.put('/:id', authorisation_middleware_1.authorisationMiddleware, body_post_validation_1.bodyPostValidation.title, body_post_validation_1.bodyPostValidation.shortDescription, body_post_validation_1.bodyPostValidation.content, body_post_validation_1.bodyPostValidation.blogId, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, shortDescription, content, blogId } = req.body;
    const updatedPost = yield posts_service_1.postsService.updatePost(req.params.id, req.body);
    if (updatedPost) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
}));
exports.postsRouter.delete('/:id', authorisation_middleware_1.authorisationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const successDel = yield posts_service_1.postsService.deletePost(req.params.id);
    if (!successDel) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
}));
