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
exports.LikesRepository = void 0;
const DB_Mongo_1 = require("../data/DB-Mongo");
class LikesRepository {
    createNewLike(zeroLike) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_Mongo_1.LikeModelClass.create(zeroLike);
        });
    }
    getLikeInfo(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.LikeModelClass.findOne({ userId: userId, commentId: commentId });
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
}
exports.LikesRepository = LikesRepository;
