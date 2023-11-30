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
        userId: string
    ) {
        return LikeModelClass.findOne({userId: userId})
    }

    async updateLike(
        newLike: likesModel,
        likeId: ObjectId
    ) {
        return LikeModelClass.updateOne({_id: likeId},
            {$set: {type: newLike.type, userId: newLike.userId, commentId: newLike.commentId}})
    }
}