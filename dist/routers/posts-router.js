"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const body_post_validation_1 = require("../middlewares/body-post-validation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const authorisation_middleware_1 = require("../middlewares/authorisation-middleware");
const auth_middleware_1 = require("../middlewares/auth-middleware");
const compostion_root_1 = require("../compostion-root");
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', compostion_root_1.postsController.getAllPosts.bind(compostion_root_1.postsController));
exports.postsRouter.post('/', authorisation_middleware_1.authorisationMiddleware, body_post_validation_1.bodyPostValidation.blogId, body_post_validation_1.bodyPostValidation.title, body_post_validation_1.bodyPostValidation.shortDescription, body_post_validation_1.bodyPostValidation.content, input_validation_middleware_1.inputValidationMiddleware, compostion_root_1.postsController.createPost.bind(compostion_root_1.postsController));
exports.postsRouter.get('/:id', compostion_root_1.postsController.getPostById.bind(compostion_root_1.postsController));
exports.postsRouter.put('/:id', authorisation_middleware_1.authorisationMiddleware, body_post_validation_1.bodyPostValidation.title, body_post_validation_1.bodyPostValidation.shortDescription, body_post_validation_1.bodyPostValidation.content, body_post_validation_1.bodyPostValidation.blogId, input_validation_middleware_1.inputValidationMiddleware, compostion_root_1.postsController.updatePost.bind(compostion_root_1.postsController));
exports.postsRouter.delete('/:id', authorisation_middleware_1.authorisationMiddleware, compostion_root_1.postsController.deletePost.bind(compostion_root_1.postsController));
exports.postsRouter.post('/:id/comments', auth_middleware_1.authMiddleware, body_post_validation_1.bodyPostValidation.comment, input_validation_middleware_1.inputValidationMiddleware, compostion_root_1.postsController.createCommentForPost.bind(compostion_root_1.postsController));
exports.postsRouter.get('/:id/comments', compostion_root_1.postsController.getCommentById.bind(compostion_root_1.postsController));
