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
const DB_Mongo_1 = require("../data/DB-Mongo");
exports.postsRepository = {
    getAllPosts(sortBy = "createdAt", sortDirection = "desc", pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let sortQuery = {};
            sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;
            const countPosts = yield DB_Mongo_1.clientPostCollection.countDocuments();
            const foundPost = yield DB_Mongo_1.clientPostCollection
                .find({}, { projection: { _id: 0 } })
                .sort(sortQuery)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();
            const objects = {
                pagesCount: Math.ceil(countPosts / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: countPosts,
                items: foundPost,
            };
            return objects;
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_Mongo_1.clientPostCollection.findOne({ id: id }, { projection: { _id: 0 } });
        });
    },
    createPost(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.clientPostCollection.insertOne(Object.assign({}, inputData));
        });
    },
    updatePost(id, inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdated = yield DB_Mongo_1.clientPostCollection.updateOne({ id: id }, {
                $set: Object.assign({}, inputData)
            });
            return isUpdated.matchedCount === 1;
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteBlog = yield DB_Mongo_1.clientPostCollection.deleteOne({ id: id });
            return deleteBlog.deletedCount === 1;
        });
    }
};
