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
exports.blogsRepository = void 0;
const crypto_1 = require("crypto");
const DB_Mongo_1 = require("../data/DB-Mongo");
exports.blogsRepository = {
    getAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.client.db('blogs_posts').collection('blogs').find({}).toArray();
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.client.db('blogs_posts').collection('blogs').findOne({ id: id });
        });
    },
    createBlog(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = {
                id: (0, crypto_1.randomUUID)(),
                name: inputData.name,
                description: inputData.description,
                websiteUrl: inputData.websiteUrl
            };
            const result = yield DB_Mongo_1.client.db('blogs_posts').collection('blogs').insertOne(newBlog);
            return newBlog;
        });
    },
    updateBlog(id, inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield DB_Mongo_1.client.db('blogs_posts').collection('blogs').updateOne({ id: id }, { $set: {
                    name: inputData.name,
                    description: inputData.description,
                    websiteUrl: inputData.websiteUrl
                } });
            return foundBlog.matchedCount === 1;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteBlog = yield DB_Mongo_1.client.db('blogs_posts').collection('blogs').deleteOne({ id: id });
            return deleteBlog.deletedCount === 1;
        });
    }
};
