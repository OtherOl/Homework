"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const crypto_1 = require("crypto");
const DB_1 = require("../data/DB");
exports.postsRepository = {
    getAllPosts() {
        return DB_1.DB.posts;
    },
    getPostById(id) {
        return DB_1.DB.posts.find(p => p.id === id);
    },
    createPost(inputData) {
        const newPost = {
            id: (0, crypto_1.randomUUID)(),
            title: inputData.title,
            shortDescription: inputData.shortDescription,
            content: inputData.content,
            blogId: inputData.blogId,
            blogName: `blog.${inputData.title}`
        };
        DB_1.DB.posts.push(newPost);
        return newPost;
    },
    updatePost(inputData) {
        const foundPost = this.getPostById(inputData.id);
        if (!foundPost) {
            return false;
        }
        else {
            foundPost.title = inputData.title;
            foundPost.shortDescription = inputData.shortDescription;
            foundPost.content = inputData.content;
            foundPost.blogId = inputData.blogId;
        }
    },
    deletePost(id) {
        const findPost = this.getPostById(id);
        if (!findPost)
            return false;
        DB_1.DB.posts = DB_1.DB.posts.filter(p => p.id !== findPost.id);
        return true;
    }
};
