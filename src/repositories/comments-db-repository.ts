import {clientCommentCollection} from "../data/DB-Mongo";
import {commentDbModel} from "../models/comments-model";

export const commentsRepository = {
    async getCommentById(
        id: string
    ) {
        const comment = await clientCommentCollection.findOne({id: id}, {projection: {_id: 0}})

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
        const comment: commentDbModel | null = await clientCommentCollection.findOne({id: commentId})

        if (!comment) {
            return false
        } else {
            await clientCommentCollection.updateOne({id: commentId}, {$set: {content: content}})
            return comment
        }
    },

    async deleteCommentById(
        commentId: string
    ) {
        const comment: commentDbModel | null = await clientCommentCollection.findOne({id: commentId})

        if (!comment) {
            return false
        } else {
            await clientCommentCollection.deleteOne({id: commentId})
            return comment
        }
    }
}