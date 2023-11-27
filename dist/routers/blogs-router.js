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
const blogs_service_1 = require("../domain/blogs-service");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const authorisation_middleware_1 = require("../middlewares/authorisation-middleware");
const body_post_validation_1 = require("../middlewares/body-post-validation");
const posts_service_1 = require("../domain/posts-service");
exports.blogsRouter = (0, express_1.Router)({});
class BlogsController {
    getAllBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const allBlogs = yield blogs_service_1.blogsService.getAllBlogs(req.query.searchNameTerm, req.query.sortBy, req.query.sortDirection, req.query.pageNumber ? +req.query.pageNumber : 1, req.query.pageSize ? +req.query.pageSize : 10);
            res.status(200).send(allBlogs);
        });
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = req.body;
            const newBlog = yield blogs_service_1.blogsService.createBlog({ name, description, websiteUrl });
            res.status(201).send(newBlog);
        });
    }
    getPostByBlogId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield blogs_service_1.blogsService.getPostByBlogId(req.params.blogId, req.query.sortBy, req.query.sortDirection, req.query.pageNumber ? +req.query.pageNumber : 1, req.query.pageSize ? +req.query.pageSize : 10);
            if (foundPost === false) {
                res.sendStatus(404);
            }
            else {
                res.status(200).send(foundPost);
            }
        });
    }
    createPostForBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogId = req.params.blogId;
            const { title, shortDescription, content } = req.body;
            const newPost = yield posts_service_1.postsService.createPost({ blogId, content, title, shortDescription });
            if (!newPost) {
                res.sendStatus(404);
            }
            else {
                res.status(201).send(newPost);
            }
        });
    }
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let findBlog = yield blogs_service_1.blogsService.getBlogById(req.params.id);
            if (!findBlog) {
                res.sendStatus(404);
            }
            else {
                res.status(200).send(findBlog);
            }
        });
    }
    updateBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = req.body;
            const updatedBlog = yield blogs_service_1.blogsService.updateBlog(req.params.id, req.body);
            if (updatedBlog) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
    deleteBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundedBlog = yield blogs_service_1.blogsService.deleteBlog(req.params.id);
            if (!foundedBlog) {
                res.sendStatus(404);
            }
            else {
                res.sendStatus(204);
            }
        });
    }
}
const blogsControllerInstance = new BlogsController();
exports.blogsRouter.get('/', blogsControllerInstance.getAllBlogs);
exports.blogsRouter.post('/', authorisation_middleware_1.authorisationMiddleware, body_blog_validation_1.bodyBlogValidation.name, body_blog_validation_1.bodyBlogValidation.description, body_blog_validation_1.bodyBlogValidation.websiteUrl, input_validation_middleware_1.inputValidationMiddleware, blogsControllerInstance.createBlog);
exports.blogsRouter.get('/:blogId/posts', blogsControllerInstance.getPostByBlogId);
exports.blogsRouter.post('/:blogId/posts', authorisation_middleware_1.authorisationMiddleware, body_post_validation_1.bodyPostValidation.title, body_post_validation_1.bodyPostValidation.shortDescription, body_post_validation_1.bodyPostValidation.content, input_validation_middleware_1.inputValidationMiddleware, blogsControllerInstance.createPostForBlog);
exports.blogsRouter.get('/:id', blogsControllerInstance.getBlogById);
exports.blogsRouter.put('/:id', authorisation_middleware_1.authorisationMiddleware, body_blog_validation_1.bodyBlogValidation.name, body_blog_validation_1.bodyBlogValidation.description, body_blog_validation_1.bodyBlogValidation.websiteUrl, input_validation_middleware_1.inputValidationMiddleware, blogsControllerInstance.updateBlog);
exports.blogsRouter.delete('/:id', authorisation_middleware_1.authorisationMiddleware, blogsControllerInstance.deleteBlogById);
