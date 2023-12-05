import {likesModel} from "../models/likes-model";
import {LikeModelClass} from "../data/DB-Mongo";
import {ObjectId} from "mongodb";

export class LikesRepository {
    async createNewLike(
        zeroLike: likesModel
    ) {
        return await LikeModelClass.create(zeroLike)
    }

    async getLikeInfo(
        userId: string,
        commentId: string | null
    ): Promise<likesModel | null> {
        return LikeModelClass.findOne({userId: userId, commentId: commentId})
    }

    async updateLike(
        newLike: likesModel,
        likeId: ObjectId
    ) {
        return LikeModelClass.updateOne({_id: likeId},
            {$set: {type: newLike.type, userId: newLike.userId, commentId: newLike.commentId}})
    }

    async updateToNone(
        like: likesModel,
        type: string
    ) {
        return LikeModelClass.updateOne({_id: like._id},
            {$set: {type: type, userId: like.userId, commentId: like.commentId}})
    }
}