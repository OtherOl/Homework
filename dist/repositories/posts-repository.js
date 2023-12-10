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
exports.PostsRepository = void 0;
const DB_Mongo_1 = require("../data/DB-Mongo");
const crypto_1 = require("crypto");
class PostsRepository {
    getAllPosts(sortBy = "createdAt", sortDirection = "desc", pageNumber, pageSize, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let sortQuery = {};
            sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;
            const like = yield DB_Mongo_1.LikeModelClass.find({ userId: userId }).lean();
            const countPosts = yield DB_Mongo_1.PostModelClass.countDocuments();
            const foundPost = yield DB_Mongo_1.PostModelClass
                .find({}, { _id: 0 })
                .sort(sortQuery)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const likes = yield DB_Mongo_1.LikeModelClass.find({ type: "Like" }, { _id: 0, type: 0 }).sort({ addedAt: -1 }).limit(3).lean();
            const postsQuery = foundPost.map(post => {
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
                items: postsQuery,
            };
            return objects;
        });
    }
    getPostById(id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield DB_Mongo_1.PostModelClass.findOne({ id: id }, { _id: 0 }).lean();
            if (!post)
                return false;
            const likes = yield DB_Mongo_1.LikeModelClass.find({ postId: id, type: "Like" }, { _id: 0, postId: 0, type: 0 }).sort({ addedAt: -1 }).limit(3).lean();
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
                    myStatus: type,
                    newestLikes: likes
                }
            };
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
                    postId: foundPost.id,
                    id: (0, crypto_1.randomUUID)(),
                    content: content,
                    commentatorInfo: {
                        userId: foundUser.id,
                        userLogin: foundUser.login
                    },
                    createdAt: new Date().toISOString(),
                    likesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: "None",
                        likesList: []
                    }
                };
                yield DB_Mongo_1.CommentModelClass.create(Object.assign({}, comment));
                return {
                    id: comment.id,
                    content: comment.content,
                    commentatorInfo: {
                        userId: comment.commentatorInfo.userId,
                        userLogin: comment.commentatorInfo.userLogin
                    },
                    createdAt: comment.createdAt,
                    likesInfo: {
                        likesCount: comment.likesInfo.likesCount,
                        dislikesCount: comment.likesInfo.dislikesCount,
                        myStatus: comment.likesInfo.myStatus
                    }
                };
            }
        });
    }
    getCommentById(postId, pageNumber, pageSize, sortBy = "createdAt", sortDirection = "desc", userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let sortQuery = {};
            sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;
            const filter = { postId: postId };
            const isExists = yield DB_Mongo_1.CommentModelClass.findOne(filter);
            const count = yield DB_Mongo_1.CommentModelClass.countDocuments(filter);
            const comment = yield DB_Mongo_1.CommentModelClass
                .find(filter, { _id: 0 })
                .sort(sortQuery)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const like = yield DB_Mongo_1.LikeModelClass.find({ userId: userId });
            const commentsQuery = comment.map(item => {
                let likeStatus = "";
                const status = like.find(a => a.commentId === item.id);
                if (status) {
                    likeStatus = status.type;
                }
                else {
                    likeStatus = 'None';
                }
                return {
                    id: item.id,
                    content: item.content,
                    commentatorInfo: item.commentatorInfo,
                    createdAt: item.createdAt,
                    likesInfo: {
                        likesCount: item.likesInfo.likesCount,
                        dislikesCount: item.likesInfo.dislikesCount,
                        myStatus: likeStatus
                    }
                };
            });
            const objects = {
                pagesCount: Math.ceil(count / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: count,
                items: commentsQuery
            };
            if (!isExists) {
                return false;
            }
            else {
                return objects;
            }
        });
    }
    updateLikesInfo(postId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type === "Like") {
                return DB_Mongo_1.PostModelClass.updateOne({ id: postId }, {
                    $inc: { "extendedLikesInfo.likesCount": +1 }
                });
            }
            if (type === "Dislike") {
                return DB_Mongo_1.PostModelClass.updateOne({ id: postId }, {
                    $inc: { "extendedLikesInfo.dislikesCount": +1 }
                });
            }
        });
    }
    decreaseLikes(postId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type === "Like")
                return DB_Mongo_1.PostModelClass.updateOne({ id: postId }, {
                    $inc: { "extendedLikesInfo.dislikesCount": -1, "extendedLikesInfo.likesCount": +1 }
                });
            if (type === "Dislike")
                return DB_Mongo_1.PostModelClass.updateOne({ id: postId }, {
                    $inc: { "extendedLikesInfo.dislikesCount": +1, "extendedLikesInfo.likesCount": -1 }
                });
            if (type === "Like to none")
                return DB_Mongo_1.PostModelClass.updateOne({ id: postId }, {
                    $inc: { "extendedLikesInfo.likesCount": -1 }
                });
            if (type === "Dislike to none")
                return DB_Mongo_1.PostModelClass.updateOne({ id: postId }, {
                    $inc: { "extendedLikesInfo.dislikesCount": -1 }
                });
        });
    }
}
exports.PostsRepository = PostsRepository;
