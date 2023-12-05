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
    constructor(likesRepository, commentsRepository) {
        this.likesRepository = likesRepository;
        this.commentsRepository = commentsRepository;
    }
    getLikeByUserId(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.likesRepository.getLikeInfo(userId, commentId);
        });
    }
    createZeroLike(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const zeroLike = {
                _id: new mongodb_1.ObjectId(),
                type: "None",
                userId: userId,
                commentId: ""
            };
            return yield this.likesRepository.createNewLike(zeroLike);
        });
    }
    createLike(type, userId, commentId, like) {
        return __awaiter(this, void 0, void 0, function* () {
            const newLike = {
                _id: new mongodb_1.ObjectId(),
                type: type,
                userId: userId,
                commentId: commentId
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
    createDislike(type, userId, commentId, like) {
        return __awaiter(this, void 0, void 0, function* () {
            const newDislike = {
                _id: new mongodb_1.ObjectId(),
                type: type,
                userId: userId,
                commentId: commentId
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
}
exports.LikesService = LikesService;
