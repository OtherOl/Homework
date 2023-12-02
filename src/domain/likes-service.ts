import {LikesRepository} from "../repositories/likes-repository";
import {likesModel} from "../models/likes-model";
import {ObjectId} from "mongodb";
import {CommentsRepository} from "../repositories/comments-repository";

export class LikesService {
    constructor(
        protected likesRepository: LikesRepository,
        protected commentsRepository: CommentsRepository
    ) {
    }

    async getLikeByUserId(
        userId: string
    ) {
        return await this.likesRepository.getLikeInfo(userId)
    }

    async createZeroLike(
        userId: string
    ) {
        const zeroLike = {
            _id: new ObjectId(),
            type: "None",
            userId: userId,
            commentId: ""
        }
        return await this.likesRepository.createNewLike(zeroLike)
    }

    async createLike(
        type: string,
        userId: string,
        commentId: string,
        like: likesModel
    ) {
        const newLike: likesModel = {
            _id: new ObjectId(),
            type: type,
            userId: userId,
            commentId: commentId
        }

        if (like.type !== "Like") {
            if (like.type === "Dislike") {
                await this.commentsRepository.decreaseDislikes(commentId, type)
            }
            await this.commentsRepository.updateLikesInfo(commentId, type)
            return await this.likesRepository.updateLike(newLike, like._id)
        }
    }

    async createDislike(
        type: string,
        userId: string,
        commentId: string,
        like: likesModel
    ) {
        const newDislike: likesModel = {
            _id: new ObjectId(),
            type: type,
            userId: userId,
            commentId: commentId
        }

        if (like.type !== "Dislike") {
            if (like.type === "Like") {
                await this.commentsRepository.decreaseLikes(commentId, type)
            }
            await this.likesRepository.updateLike(newDislike, like._id)
            return await this.commentsRepository.updateDislikesInfo(commentId, userId)
        }
    }

    async setToNoneIfLike(
        like: likesModel,
        type: string
    ) {
        await this.commentsRepository.decreaseLikes(like.commentId, type)
        return await this.likesRepository.updateToNone(like, type)
    }

    async setToNoneIfDis(
        like: likesModel,
        type: string
    ) {
        await this.commentsRepository.decreaseDislikes(like.commentId, type)
        return await this.likesRepository.updateToNone(like, type)
    }
}