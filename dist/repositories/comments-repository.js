"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.CommentsRepository = void 0;
const DB_Mongo_1 = require("../data/DB-Mongo");
const inversify_1 = require("inversify");
let CommentsRepository = class CommentsRepository {
    getCommentById(id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield DB_Mongo_1.CommentModelClass.findOne({ id: id }, { _id: 0 });
            if (!comment) {
                return false;
            }
            else {
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
                        myStatus: type
                    }
                };
            }
        });
    }
    updateComment(commentId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield DB_Mongo_1.CommentModelClass.findOne({ id: commentId });
            if (!comment) {
                return false;
            }
            else {
                yield DB_Mongo_1.CommentModelClass.updateOne({ id: commentId }, { $set: { content: content } });
                return comment;
            }
        });
    }
    deleteCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield DB_Mongo_1.CommentModelClass.findOne({ id: commentId });
            if (!comment) {
                return false;
            }
            else {
                yield DB_Mongo_1.LikeModelClass.deleteMany({ commentId: commentId });
                yield DB_Mongo_1.CommentModelClass.deleteOne({ id: commentId });
                return comment;
            }
        });
    }
    updateLikesInfo(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield DB_Mongo_1.CommentModelClass.findOne({ id: commentId });
            if (!comment) {
                return false;
            }
            else {
                yield DB_Mongo_1.CommentModelClass.updateOne({ id: commentId }, {
                    $inc: { "likesInfo.likesCount": +1 }, $push: { "likesInfo.likesList": userId }
                });
                return comment;
            }
        });
    }
    decreaseLikes(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DB_Mongo_1.CommentModelClass.updateOne({ id: commentId }, {
                $inc: { "likesInfo.likesCount": -1 }, $pull: { "likesInfo.likesList": userId }
            });
        });
    }
    updateDislikesInfo(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield DB_Mongo_1.CommentModelClass.findOne({ id: commentId });
            if (!comment) {
                return false;
            }
            else {
                yield DB_Mongo_1.CommentModelClass.updateOne({ id: commentId }, {
                    $inc: { "likesInfo.dislikesCount": +1 }, $push: { "likesInfo.likesList": userId }
                });
                return comment;
            }
        });
    }
    decreaseDislikes(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DB_Mongo_1.CommentModelClass.updateOne({ id: commentId }, {
                $inc: { "likesInfo.dislikesCount": -1 }, $pull: { "likesInfo.likesList": userId }
            });
        });
    }
};
exports.CommentsRepository = CommentsRepository;
exports.CommentsRepository = CommentsRepository = __decorate([
    (0, inversify_1.injectable)()
], CommentsRepository);
