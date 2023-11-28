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
exports.PostsService = void 0;
const crypto_1 = require("crypto");
class PostsService {
    constructor(blogsRepository, postsRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
    }
    getAllPosts(sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.getAllPosts(sortBy, sortDirection, pageNumber, pageSize);
        });
    }
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.getPostById(id);
        });
    }
    createPost(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsRepository.getBlogById(inputData.blogId);
            if (!blog)
                return null;
            const newPost = {
                id: (0, crypto_1.randomUUID)(),
                title: inputData.title,
                shortDescription: inputData.shortDescription,
                content: inputData.content,
                blogId: blog.id,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            };
            yield this.postsRepository.createPost(newPost);
            return {
                id: newPost.id,
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                createdAt: newPost.createdAt
            };
        });
    }
    updatePost(id, inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.updatePost(id, inputData);
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.deletePost(id);
        });
    }
    createComment(id, content, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.createComment(id, content, userId);
        });
    }
    getCommentById(id, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.getCommentById(id, pageNumber, pageSize, sortBy, sortDirection);
        });
    }
}
exports.PostsService = PostsService;
// export const postsService = new PostsService()
