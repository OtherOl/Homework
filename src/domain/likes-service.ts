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

    async createLike(
        type: string,
        userId: string,
        commentId: string
    ) {
        const like = await this.likesRepository.getLikeInfo(userId)
        const newLike: likesModel = {
            _id: new ObjectId(),
            type: type,
            userId: userId,
            commentId: commentId
        }
        const zeroLike = {
            _id: new ObjectId(),
            type: "None",
            userId: "",
            commentId: ""
        }
        if(!like) {
            await this.likesRepository.createNewLike(zeroLike)
        }

        if(like!.type !== "Like") {
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
        const newDislike: likesModel = {
            _id: new ObjectId(),
            type: type,
            userId: userId,
            commentId: commentId
        }

        const zeroLike = {
            _id: new ObjectId(),
            type: "None",
            userId: "",
            commentId: ""
        }

        if(!like) {
            await this.likesRepository.createNewLike(zeroLike)
        }

        if(like!.type !== "Dislike") {
            await this.commentsRepository.updateDislikesInfo(commentId, type)
            return await this.likesRepository.updateLike(newDislike, like!._id, zeroLike._id)
        }
    }
}