import {CommentModel} from "../data/DB-Mongo";
import {commentDbModel} from "../models/comments-model";

export const commentsRepository = {
    async getCommentById(
        id: string
    ) {
        const comment = await CommentModel.findOne({id: id}, {projection: {_id: 0}})

        if (!comment) {
            return false
        } else {
            return comment
        }
    },

    async updateComment(
        commentId: string,
        content: string,
    ) {
        const comment: commentDbModel | null = await CommentModel.findOne({id: commentId})

        if (!comment) {
            return false
        } else {
            await CommentModel.updateOne({id: commentId}, {$set: {content: content}})
            return comment
        }
    },

    async deleteCommentById(
        commentId: string
    ) {
        const comment: commentDbModel | null = await CommentModel.findOne({id: commentId})

        if (!comment) {
            return false
        } else {
            await CommentModel.deleteOne({id: commentId})
            return comment
        }
    }
}