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
const DB_Mongo_1 = require("../data/DB-Mongo");
exports.blogsRepository = {
    getAllBlogs(searchNameTerm, sortBy = "createdAt", sortDirection = "desc", pageNumber = 1, pageSize = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            let sortQuery = {};
            sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;
            //ctrl+alt+l
            const filter = { name: RegExp(searchNameTerm, "i") };
            const countBlogs = yield DB_Mongo_1.clientBlogCollection.countDocuments(filter);
            const foundBlog = yield DB_Mongo_1.clientBlogCollection
                .find({ name: RegExp(searchNameTerm, "i") }, { projection: { _id: 0 } })
                .sort(sortQuery)
                .skip(pageNumber - 1)
                .limit(pageSize)
                .toArray();
            const objects = {
                pagesCount: Math.ceil(countBlogs / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: countBlogs,
                items: foundBlog,
            };
            return objects;
        });
    },
    getPostByBlogId(blogId, sortBy = "createdAt", sortDirection = "desc", pageNumber = 1, pageSize = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            let sortQuery = {};
            sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;
            const countPosts = yield DB_Mongo_1.clientPostCollection.countDocuments({ blogId: blogId });
            const foundPosts = yield DB_Mongo_1.clientPostCollection.find({ blogId: blogId }, { projection: { _id: 0 } })
                .sort(sortQuery).skip(pageNumber - 1).limit(pageSize).toArray();
            const objects = {
                pagesCount: Math.ceil(countPosts / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: countPosts,
                items: foundPosts
            };
            return objects;
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_Mongo_1.clientBlogCollection.findOne({ id: id }, { projection: { _id: 0 } });
        });
    },
    createBlog(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield DB_Mongo_1.clientBlogCollection.insertOne(Object.assign({}, inputData));
            return inputData;
        });
    },
    updateBlog(id, inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield DB_Mongo_1.clientBlogCollection.updateOne({ id: id }, {
                $set: {
                    name: inputData.name,
                    description: inputData.description,
                    websiteUrl: inputData.websiteUrl
                }
            });
            return foundBlog.matchedCount === 1;
        });
    },
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteBlog = yield DB_Mongo_1.clientBlogCollection.deleteOne({ id: id });
            return deleteBlog.deletedCount === 1;
        });
    }
};
