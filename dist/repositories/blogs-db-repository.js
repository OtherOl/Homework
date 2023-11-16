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
    getAllBlogs(searchNameTerm, sortBy = "createdAt", sortDirection = "desc", pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let sortQuery = {};
            sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;
            const filter = { name: RegExp(searchNameTerm, "i") };
            const countBlogs = yield DB_Mongo_1.BlogModel.countDocuments(filter);
            const foundBlog = yield DB_Mongo_1.BlogModel
                .find(filter, { projection: { _id: 0 } })
                .sort(sortQuery)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
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
    getPostByBlogId(blogId, sortBy = "createdAt", sortDirection = "desc", pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let sortQuery = {};
            sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;
            const filter = { blogId: blogId };
            const isExists = yield DB_Mongo_1.BlogModel.findOne({ id: blogId });
            const countPosts = yield DB_Mongo_1.PostModel.countDocuments(filter);
            const foundPosts = yield DB_Mongo_1.PostModel
                .find(filter, { projection: { _id: 0 } })
                .sort(sortQuery)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const objects = {
                pagesCount: Math.ceil(countPosts / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: countPosts,
                items: foundPosts
            };
            if (!isExists) {
                return false;
            }
            else {
                return objects;
            }
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.BlogModel.findOne({ id: id }, { projection: { _id: 0 } });
        });
    },
    createBlog(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DB_Mongo_1.BlogModel.create(Object.assign({}, inputData));
            return inputData;
        });
    },
    updateBlog(id, inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield DB_Mongo_1.BlogModel.updateOne({ id: id }, {
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
            const deleteBlog = yield DB_Mongo_1.BlogModel.deleteOne({ id: id });
            return deleteBlog.deletedCount === 1;
        });
    }
};
