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
exports.LikesService = void 0;
const mongodb_1 = require("mongodb");
class LikesService {
    constructor(likesRepository, commentsRepository, postsService) {
        this.likesRepository = likesRepository;
        this.commentsRepository = commentsRepository;
        this.postsService = postsService;
    }
    getLikeByUserIdComment(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.likesRepository.getLikeInfoComment(userId, commentId);
        });
    }
    getLikeByUserIdPost(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.likesRepository.getLikeInfoPost(userId, postId);
        });
    }
    createZeroLike(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const zeroLike = {
                _id: new mongodb_1.ObjectId(),
                type: "None",
                userId: userId,
                commentId: "",
                addedAt: new Date().toISOString()
            };
            return yield this.likesRepository.createNewCommentLike(zeroLike);
        });
    }
    createCommentLike(type, userId, commentId, like) {
        return __awaiter(this, void 0, void 0, function* () {
            const newLike = {
                _id: new mongodb_1.ObjectId(),
                type: type,
                userId: userId,
                commentId: commentId,
                addedAt: new Date().toISOString()
            };
            if (like.type !== "Like") {
                if (like.type === "Dislike") {
                    yield this.commentsRepository.decreaseDislikes(commentId, userId);
                }
                yield this.commentsRepository.updateLikesInfo(commentId, userId);
                return yield this.likesRepository.updateLike(newLike, like._id);
            }
        });
    }
    createCommentDislike(type, userId, commentId, like) {
        return __awaiter(this, void 0, void 0, function* () {
            const newDislike = {
                _id: new mongodb_1.ObjectId(),
                type: type,
                userId: userId,
                commentId: commentId,
                addedAt: new Date().toISOString()
            };
            if (like.type !== "Dislike") {
                if (like.type === "Like") {
                    yield this.commentsRepository.decreaseLikes(commentId, userId);
                }
                yield this.likesRepository.updateLike(newDislike, like._id);
                return yield this.commentsRepository.updateDislikesInfo(commentId, userId);
            }
        });
    }
    setToNoneIfLike(like, type) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.commentsRepository.decreaseLikes(like.commentId, like.userId);
            return yield this.likesRepository.updateToNone(like, type);
        });
    }
    setToNoneIfDis(like, type) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.commentsRepository.decreaseDislikes(like.commentId, like.userId);
            return yield this.likesRepository.updateToNone(like, type);
        });
    }
    createPostLike(like, type, userId, postId, login) {
        return __awaiter(this, void 0, void 0, function* () {
            if (like) {
                if (like.type === "Dislike") {
                    yield this.likesRepository.updateLikeType(like._id, type);
                    return yield this.postsService.decreaseLikes(postId, "Like");
                }
                if (like.type === "Like")
                    return true;
                if (like.type === "None") {
                    yield this.likesRepository.updateLikeType(like._id, type);
                    return yield this.postsService.updateLikesInfo(postId, type);
                }
            }
            else {
                const newLike = {
                    _id: new mongodb_1.ObjectId(),
                    type: type,
                    userId: userId,
                    postId: postId,
                    addedAt: new Date().toISOString(),
                    login: login
                };
                yield this.postsService.updateLikesInfo(postId, type);
                return yield this.likesRepository.createPostLike(newLike);
            }
        });
    }
    createPostDislike(like, type, userId, postId, login) {
        return __awaiter(this, void 0, void 0, function* () {
            if (like) {
                if (like.type === "Like") {
                    yield this.likesRepository.updateLikeType(like._id, type);
                    return yield this.postsService.decreaseLikes(postId, type);
                }
                if (like.type === "Dislike")
                    return true;
                if (like.type === "None") {
                    yield this.likesRepository.updateLikeType(like._id, type);
                    return yield this.postsService.updateLikesInfo(postId, type);
                }
            }
            else {
                const newLike = {
                    _id: new mongodb_1.ObjectId(),
                    type: type,
                    userId: userId,
                    postId: postId,
                    addedAt: new Date().toISOString(),
                    login: login
                };
                yield this.postsService.updateLikesInfo(postId, type);
                return this.likesRepository.createPostLike(newLike);
            }
        });
    }
    updateToNone(like) {
        return __awaiter(this, void 0, void 0, function* () {
            if (like.type === "Like") {
                yield this.postsService.decreaseLikes(like.postId, "Like to none");
                return yield this.likesRepository.updateLikeType(like._id, "None");
            }
            if (like.type === "Dislike") {
                yield this.postsService.decreaseLikes(like.postId, "Dislike to none");
                return yield this.likesRepository.updateLikeType(like._id, "None");
            }
        });
    }
}
exports.LikesService = LikesService;
