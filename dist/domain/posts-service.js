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
exports.postsService = void 0;
const crypto_1 = require("crypto");
const posts_db_repository_1 = require("../repositories/posts-db-repository");
const blogs_db_repository_1 = require("../repositories/blogs-db-repository");
const mongodb_1 = require("mongodb");
exports.postsService = {
    getAllPosts(sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.getAllPosts(sortBy, sortDirection, pageNumber, pageSize);
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.getPostById(id);
        });
    },
    createPost(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_db_repository_1.blogsRepository.getBlogById(inputData.blogId);
            if (!blog)
                return null;
            const newPost = {
                _id: new mongodb_1.ObjectId(),
                id: (0, crypto_1.randomUUID)(),
                title: inputData.title,
                shortDescription: inputData.shortDescription,
                content: inputData.content,
                blogId: blog.id,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            };
            yield posts_db_repository_1.postsRepository.createPost(newPost);
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
    },
    updatePost(id, inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.updatePost(id, inputData);
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.deletePost(id);
        });
    },
    createComment(id, content, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.createComment(id, content, userId);
        });
    },
    getCommentById(id, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.getCommentById(id, pageNumber, pageSize, sortBy, sortDirection);
        });
    },
};
