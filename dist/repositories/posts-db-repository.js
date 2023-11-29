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
exports.PostsRepository = void 0;
const DB_Mongo_1 = require("../data/DB-Mongo");
class PostsRepository {
    getAllPosts(sortBy = "createdAt", sortDirection = "desc", pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let sortQuery = {};
            sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;
            const countPosts = yield DB_Mongo_1.PostModelClass.countDocuments();
            const foundPost = yield DB_Mongo_1.PostModelClass
                .find({}, { _id: 0 })
                .sort(sortQuery)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const objects = {
                pagesCount: Math.ceil(countPosts / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: countPosts,
                items: foundPost,
            };
            return objects;
        });
    }
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.PostModelClass.findOne({ id: id }, { _id: 0 });
        });
    }
    createPost(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_Mongo_1.PostModelClass.create(Object.assign({}, inputData));
        });
    }
    updatePost(id, inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUpdated = yield DB_Mongo_1.PostModelClass.updateOne({ id: id }, {
                $set: Object.assign({}, inputData)
            });
            return isUpdated.matchedCount === 1;
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteBlog = yield DB_Mongo_1.PostModelClass.deleteOne({ id: id });
            return deleteBlog.deletedCount === 1;
        });
    }
    createComment(id, content, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield DB_Mongo_1.PostModelClass.findOne({ id: id });
            const foundUser = yield DB_Mongo_1.UserModelClass.findOne({ id: userId });
            if (!foundPost) {
                return false;
            }
            else {
                const comment = {
                    id: foundPost.id,
                    content: content,
                    commentatorInfo: {
                        userId: foundUser.id,
                        userLogin: foundUser.login
                    },
                    createdAt: new Date().toISOString(),
                    likesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: "None"
                    }
                };
                yield DB_Mongo_1.CommentModelClass.create(Object.assign({}, comment));
                return comment;
            }
        });
    }
    getCommentById(id, pageNumber, pageSize, sortBy = "createdAt", sortDirection = "desc") {
        return __awaiter(this, void 0, void 0, function* () {
            let sortQuery = {};
            sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;
            const filter = { id: id };
            const isExists = yield DB_Mongo_1.CommentModelClass.findOne(filter);
            const count = yield DB_Mongo_1.CommentModelClass.countDocuments(filter);
            const comment = yield DB_Mongo_1.CommentModelClass
                .find(filter, { _id: 0 })
                .sort(sortQuery)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const objects = {
                pagesCount: Math.ceil(count / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: count,
                items: comment
            };
            if (!isExists) {
                return false;
            }
            else {
                return objects;
            }
        });
    }
}
exports.PostsRepository = PostsRepository;
