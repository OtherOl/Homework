import {likesCommentModel, likesPostModel} from "../models/likes-model";
import {LikeModelClass} from "../data/DB-Mongo";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class LikesRepository {
    async createNewCommentLike(
        zeroLike: likesCommentModel
    ) {
        return await LikeModelClass.create(zeroLike)
    }

    async createPostLike(
        like: likesPostModel
    ) {
        return await LikeModelClass.create(like)
    }

    async getLikeInfoComment(
        userId: string,
        commentId: string | null
    ): Promise<likesCommentModel | null> {
        return LikeModelClass.findOne({userId: userId, commentId: commentId})
    }

    async getLikeInfoPost(
        userId: string,
        postId: string | null
    ): Promise<likesPostModel | null> {
        return LikeModelClass.findOne({userId: userId, postId: postId})
    }

    async updateLike(
        newLike: likesCommentModel,
        likeId: ObjectId
    ) {
        return LikeModelClass.updateOne({_id: likeId},
            {$set: {type: newLike.type, userId: newLike.userId, commentId: newLike.commentId}})
    }

    async updateToNone(
        like: likesCommentModel,
        type: string
    ) {
        return LikeModelClass.updateOne({_id: like._id},
            {$set: {type: type, userId: like.userId, commentId: like.commentId}})
    }

    async updateLikeType(
        likeId: ObjectId,
        type: string
    ) {
        return LikeModelClass.updateOne({_id: likeId}, {
            $set: {type: type}
        })
    }
}