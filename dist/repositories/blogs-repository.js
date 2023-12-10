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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsRepository = void 0;
const DB_Mongo_1 = require("../data/DB-Mongo");
class BlogsRepository {
    getAllBlogs(searchNameTerm, sortBy = "createdAt", sortDirection = "desc", pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let sortQuery = {};
            sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;
            const filter = { name: RegExp(searchNameTerm, "i") };
            const countBlogs = yield DB_Mongo_1.BlogModelClass.countDocuments(filter);
            const foundBlog = yield DB_Mongo_1.BlogModelClass
                .find(filter, { _id: 0 })
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
    }
    getPostByBlogId(blogId, sortBy = "createdAt", sortDirection = "desc", pageNumber, pageSize, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let sortQuery = {};
            sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;
            const filter = { blogId: blogId };
            const like = yield DB_Mongo_1.LikeModelClass.find({ userId: userId }).lean();
            const isExists = yield DB_Mongo_1.BlogModelClass.findOne({ id: blogId });
            const countPosts = yield DB_Mongo_1.PostModelClass.countDocuments(filter);
            const foundPosts = yield DB_Mongo_1.PostModelClass
                .find(filter, { _id: 0 })
                .sort(sortQuery)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const likes = yield DB_Mongo_1.LikeModelClass.find({ type: "Like" }, { _id: 0, type: 0 }).sort({ addedAt: -1 }).limit(3).lean();
            const postsQuery = foundPosts.map(post => {
                let likeStatus = "";
                const status = like.find(a => a.postId === post.id);
                const newestLikes = likes.filter(a => a.postId === post.id);
                if (status) {
                    likeStatus = status.type;
                }
                else {
                    likeStatus = 'None';
                }
                return {
                    id: post.id,
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                    extendedLikesInfo: {
                        likesCount: post.extendedLikesInfo.likesCount,
                        dislikesCount: post.extendedLikesInfo.dislikesCount,
                        myStatus: likeStatus,
                        newestLikes: newestLikes.map(like => {
                            const { postId } = like, rest = __rest(like, ["postId"]);
                            return rest;
                        })
                    }
                };
            });
            const objects = {
                pagesCount: Math.ceil(countPosts / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: countPosts,
                items: postsQuery
            };
            if (!isExists) {
                return false;
            }
            else {
                return objects;
            }
        });
    }
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.BlogModelClass.findOne({ id: id }, { projection: { _id: 0 } });
        });
    }
    createBlog(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DB_Mongo_1.BlogModelClass.create(Object.assign({}, inputData));
            return inputData;
        });
    }
    updateBlog(id, inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield DB_Mongo_1.BlogModelClass.updateOne({ id: id }, {
                $set: {
                    name: inputData.name,
                    description: inputData.description,
                    websiteUrl: inputData.websiteUrl
                }
            });
            return foundBlog.matchedCount === 1;
        });
    }
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteBlog = yield DB_Mongo_1.BlogModelClass.deleteOne({ id: id });
            return deleteBlog.deletedCount === 1;
        });
    }
}
exports.BlogsRepository = BlogsRepository;
