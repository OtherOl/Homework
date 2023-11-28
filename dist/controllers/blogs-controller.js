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
exports.BlogsController = void 0;
class BlogsController {
    constructor(blogsService, postsService) {
        this.blogsService = blogsService;
        this.postsService = postsService;
    }
    getAllBlogs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const allBlogs = yield this.blogsService.getAllBlogs(req.query.searchNameTerm, req.query.sortBy, req.query.sortDirection, req.query.pageNumber ? +req.query.pageNumber : 1, req.query.pageSize ? +req.query.pageSize : 10);
            res.status(200).send(allBlogs);
        });
    }
    createBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = req.body;
            const newBlog = yield this.blogsService.createBlog({ name, description, websiteUrl });
            res.status(201).send(newBlog);
        });
    }
    getPostByBlogId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield this.blogsService.getPostByBlogId(req.params.blogId, req.query.sortBy, req.query.sortDirection, req.query.pageNumber ? +req.query.pageNumber : 1, req.query.pageSize ? +req.query.pageSize : 10);
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
            const newPost = yield this.postsService.createPost({ blogId, content, title, shortDescription });
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
            let findBlog = yield this.blogsService.getBlogById(req.params.id);
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
            const updatedBlog = yield this.blogsService.updateBlog(req.params.id, req.body);
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
            const foundedBlog = yield this.blogsService.deleteBlog(req.params.id);
            if (!foundedBlog) {
                res.sendStatus(404);
            }
            else {
                res.sendStatus(204);
            }
        });
    }
}
exports.BlogsController = BlogsController;
