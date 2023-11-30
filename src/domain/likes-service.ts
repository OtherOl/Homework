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

    async createLike(
        type: string,
        userId: string,
        commentId: string
    ) {
        const like = await this.likesRepository.getLikeInfo(userId)
        const zeroLike = {
            _id: new ObjectId(),
            type: "None",
            userId: userId,
            commentId: ""
        }
        if (!like) {
            await this.likesRepository.createNewLike(zeroLike)
        }

        const newLike: likesModel = {
            _id: new ObjectId(),
            type: type,
            userId: userId,
            commentId: commentId
        }

        if (like!.type !== "Like") {
            if(like!.type === "Dislike") {
                await this.commentsRepository.decreaseDislikes(commentId, type)
            }
            await this.commentsRepository.updateLikesInfo(commentId, type)
            return await this.likesRepository.updateLike(newLike, like!._id, zeroLike._id)
        }
    }

    async createDislike(
        type: string,
        userId: string,
        commentId: string
    ) {
        const like = await this.likesRepository.getLikeInfo(userId)
        const zeroLike = {
            _id: new ObjectId(),
            type: "None",
            userId: userId,
            commentId: ""
        }
        if (!like) {
            await this.likesRepository.createNewLike(zeroLike)
        }
        const newDislike: likesModel = {
            _id: new ObjectId(),
            type: type,
            userId: userId,
            commentId: commentId
        }

        if (like!.type !== "Dislike") {
            if (like!.type === "Like") {
                await this.commentsRepository.decreaseLikes(commentId, type)
            }
            await this.likesRepository.updateLike(newDislike, like!._id, zeroLike._id)
            return await this.commentsRepository.updateDislikesInfo(commentId, userId)
        }
    }
}