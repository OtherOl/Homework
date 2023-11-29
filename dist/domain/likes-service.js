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
    createLike(type, userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield this.likesRepository.getLikeInfo(userId);
            const newLike = {
                _id: new mongodb_1.ObjectId(),
                type: type,
                userId: userId,
                commentId: commentId
            };
            const zeroLike = {
                _id: new mongodb_1.ObjectId(),
                type: "None",
                userId: "",
                commentId: ""
            };
            if (!like) {
                yield this.likesRepository.createNewLike(zeroLike);
            }
            if (like.type !== "Like") {
                yield this.commentsRepository.updateLikesInfo(commentId, type);
                return yield this.likesRepository.updateLike(newLike, like._id, zeroLike._id);
            }
        });
    }
    createDislike(type, userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = yield this.likesRepository.getLikeInfo(userId);
            const newDislike = {
                _id: new mongodb_1.ObjectId(),
                type: type,
                userId: userId,
                commentId: commentId
            };
            const zeroLike = {
                _id: new mongodb_1.ObjectId(),
                type: "None",
                userId: "",
                commentId: ""
            };
            if (!like) {
                yield this.likesRepository.createNewLike(zeroLike);
            }
            if (like.type !== "Dislike") {
                yield this.commentsRepository.updateDislikesInfo(commentId, type);
                return yield this.likesRepository.updateLike(newDislike, like._id, zeroLike._id);
            }
        });
    }
}
exports.LikesService = LikesService;
