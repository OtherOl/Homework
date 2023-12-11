import {LikesRepository} from "../repositories/likes-repository";
import {likesCommentModel, likesPostModel} from "../models/likes-model";
import {ObjectId} from "mongodb";
import {CommentsRepository} from "../repositories/comments-repository";
import {PostsService} from "./posts-service";
import {injectable} from "inversify";

@injectable()
export class LikesService {
    constructor(
        protected likesRepository: LikesRepository,
        protected commentsRepository: CommentsRepository,
        private postsService: PostsService
    ) {
    }

    async getLikeByUserIdComment(
        userId: string,
        commentId: string | null
    ) {
        return await this.likesRepository.getLikeInfoComment(userId, commentId)
    }

    async getLikeByUserIdPost(
        userId: string,
        postId: string | null
    ): Promise<likesPostModel | null> {
        return await this.likesRepository.getLikeInfoPost(userId, postId)
    }

    async createZeroLike(
        userId: string
    ) {
        const zeroLike = {
            _id: new ObjectId(),
            type: "None",
            userId: userId,
            commentId: "",
            addedAt: new Date().toISOString()
        }
        return await this.likesRepository.createNewCommentLike(zeroLike)
    }

    async createCommentLike(
        type: string,
        userId: string,
        commentId: string,
        like: likesCommentModel
    ) {
        const newLike: likesCommentModel = {
            _id: new ObjectId(),
            type: type,
            userId: userId,
            commentId: commentId,
            addedAt: new Date().toISOString()
        }

        if (like.type !== "Like") {
            if (like.type === "Dislike") {
                await this.commentsRepository.decreaseDislikes(commentId, userId)
            }
            await this.commentsRepository.updateLikesInfo(commentId, userId)
            return await this.likesRepository.updateLike(newLike, like._id)
        }
    }

    async createCommentDislike(
        type: string,
        userId: string,
        commentId: string,
        like: likesCommentModel
    ) {
        const newDislike: likesCommentModel = {
            _id: new ObjectId(),
            type: type,
            userId: userId,
            commentId: commentId,
            addedAt: new Date().toISOString()
        }

        if (like.type !== "Dislike") {
            if (like.type === "Like") {
                await this.commentsRepository.decreaseLikes(commentId, userId)
            }
            await this.likesRepository.updateLike(newDislike, like._id)
            return await this.commentsRepository.updateDislikesInfo(commentId, userId)
        }
    }

    async setToNoneIfLike(
        like: likesCommentModel,
        type: string
    ) {
        await this.commentsRepository.decreaseLikes(like.commentId, like.userId)
        return await this.likesRepository.updateToNone(like, type)
    }

    async setToNoneIfDis(
        like: likesCommentModel,
        type: string
    ) {
        await this.commentsRepository.decreaseDislikes(like.commentId, like.userId)
        return await this.likesRepository.updateToNone(like, type)
    }

    async createPostLike(
        like: likesPostModel | null,
        type: string,
        userId: string,
        postId: string,
        login: string
    ) {
        if (like) {
            if (like.type === "Dislike") {
                await this.likesRepository.updateLikeType(like._id, type)
                return await this.postsService.decreaseLikes(postId, "Like")
            }
            if (like.type === "Like") return true
            if (like.type === "None") {
                await this.likesRepository.updateLikeType(like._id, type)
                return await this.postsService.updateLikesInfo(postId, type)
            }
        } else {
            const newLike = {
                _id: new ObjectId(),
                type: type,
                userId: userId,
                postId: postId,
                addedAt: new Date().toISOString(),
                login: login
            }

            await this.postsService.updateLikesInfo(postId, type)
            return await this.likesRepository.createPostLike(newLike)
        }
    }

    async createPostDislike(
        like: likesPostModel | null,
        type: string,
        userId: string,
        postId: string,
        login: string
    ) {
        if (like) {
            if (like.type === "Like") {
                await this.likesRepository.updateLikeType(like._id, type)
                return await this.postsService.decreaseLikes(postId, type)
            }
            if (like.type === "Dislike") return true
            if (like.type === "None") {
                await this.likesRepository.updateLikeType(like._id, type)
                return await this.postsService.updateLikesInfo(postId, type)
            }
        } else {
            const newLike = {
                _id: new ObjectId(),
                type: type,
                userId: userId,
                postId: postId,
                addedAt: new Date().toISOString(),
                login: login
            }

            await this.postsService.updateLikesInfo(postId, type)
            return this.likesRepository.createPostLike(newLike)
        }
    }

    async updateToNone(
        like: likesPostModel
    ) {
        if (like.type === "Like") {
            await this.postsService.decreaseLikes(like.postId, "Like to none")
            return await this.likesRepository.updateLikeType(like._id, "None")
        }

        if (like.type === "Dislike") {
            await this.postsService.decreaseLikes(like.postId, "Dislike to none")
            return await this.likesRepository.updateLikeType(like._id, "None")
        }
    }
}