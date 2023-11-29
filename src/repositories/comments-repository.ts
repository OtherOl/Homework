import {CommentModelClass} from "../data/DB-Mongo";
import {commentDbModel} from "../models/comments-model";

export class CommentsRepository {
    async getCommentById(
        id: string
    ) {
        const comment = await CommentModelClass.findOne({id: id}, {_id: 0})

        if (!comment) {
            return false
        } else {
            return comment
        }
    }

    async updateComment(
        commentId: string,
        content: string,
    ) {
        const comment: commentDbModel | null = await CommentModelClass.findOne({id: commentId})

        if (!comment) {
            return false
        } else {
            await CommentModelClass.updateOne({id: commentId}, {$set: {content: content}})
            return comment
        }
    }

    async deleteCommentById(
        commentId: string
    ) {
        const comment: commentDbModel | null = await CommentModelClass.findOne({id: commentId})

        if (!comment) {
            return false
        } else {
            await CommentModelClass.deleteOne({id: commentId})
            return comment
        }
    }

    async updateLikesInfo(
        commentId: string,
        type: string
    ) {
        const comment: commentDbModel | null = await CommentModelClass.findOne({id: commentId})

        if (!comment) {
            return false
        } else {
            await CommentModelClass.updateOne({id: commentId}, {$set: {
                "likesInfo.myStatus": type}, $inc: {"likesInfo.likesCount": 1}})
            return comment
        }
    }

    async updateDislikesInfo(
        commentId: string,
        type: string
    ) {
        const comment: commentDbModel | null = await CommentModelClass.findOne({id: commentId})

        if (!comment) {
            return false
        } else {
            await CommentModelClass.updateOne({id: commentId}, {$set: {
                    "likesInfo.myStatus": type}, $inc: {"likesInfo.dislikesCount": 1}})
            return comment
        }
    }
}
