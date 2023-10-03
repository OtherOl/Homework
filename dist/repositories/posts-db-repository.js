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
exports.postsRepository = void 0;
const crypto_1 = require("crypto");
const DB_Mongo_1 = require("../data/DB-Mongo");
exports.postsRepository = {
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.client.db('blogs_posts').collection('posts').find({}, { projection: { _id: 0 } }).toArray();
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.client.db('blogs_posts').collection('posts').findOne({ id: id }, { projection: { _id: 0 } });
        });
    },
    createPost(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPost = {
                id: (0, crypto_1.randomUUID)(),
                title: inputData.title,
                shortDescription: inputData.shortDescription,
                content: inputData.content,
                blogId: inputData.blogId,
                blogName: `blog.${inputData.title}`,
                createdAt: new Date().toISOString()
            };
            const result = yield DB_Mongo_1.client.db('blogs_posts').collection('posts').insertOne(newPost);
            return newPost;
        });
    },
    updatePost(id, inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdated = yield DB_Mongo_1.client.db('blogs_posts').collection('posts').updateOne({ id: id }, { $set: {
                    title: inputData.title,
                    shortDescription: inputData.shortDescription,
                    content: inputData.content,
                    blogId: inputData.blogId
                } });
            return isUpdated.matchedCount === 1;
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.client.db('blogs_posts').collection('posts').deleteOne({ id: id });
        });
    }
};
