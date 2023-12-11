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
exports.LikesRepository = void 0;
const DB_Mongo_1 = require("../data/DB-Mongo");
const inversify_1 = require("inversify");
let LikesRepository = class LikesRepository {
    createNewCommentLike(zeroLike) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_Mongo_1.LikeModelClass.create(zeroLike);
        });
    }
    createPostLike(like) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_Mongo_1.LikeModelClass.create(like);
        });
    }
    getLikeInfoComment(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.LikeModelClass.findOne({ userId: userId, commentId: commentId });
        });
    }
    getLikeInfoPost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.LikeModelClass.findOne({ userId: userId, postId: postId });
        });
    }
    updateLike(newLike, likeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.LikeModelClass.updateOne({ _id: likeId }, { $set: { type: newLike.type, userId: newLike.userId, commentId: newLike.commentId } });
        });
    }
    updateToNone(like, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.LikeModelClass.updateOne({ _id: like._id }, { $set: { type: type, userId: like.userId, commentId: like.commentId } });
        });
    }
    updateLikeType(likeId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.LikeModelClass.updateOne({ _id: likeId }, {
                $set: { type: type }
            });
        });
    }
};
exports.LikesRepository = LikesRepository;
exports.LikesRepository = LikesRepository = __decorate([
    (0, inversify_1.injectable)()
], LikesRepository);
