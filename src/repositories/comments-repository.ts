import {CommentModelClass, LikeModelClass} from "../data/DB-Mongo";
import {commentDbModel} from "../models/comments-model";

export class CommentsRepository {
    async getCommentById(
        id: string,
        type: string
    ) {
        const comment: commentDbModel | null = await CommentModelClass.findOne({id: id}, {_id: 0})

        if (!comment) {
            return false
        } else {
            return {
                id: comment.id,
                content: comment.content,
                commentatorInfo: {
                    userId: comment.commentatorInfo.userId,
                    userLogin: comment.commentatorInfo.userLogin
                },
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount: comment.likesInfo.likesCount,
                    dislikesCount: comment.likesInfo.dislikesCount,
                    myStatus: type
                }
            }
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
            await LikeModelClass.deleteMany({commentId: commentId})
            await CommentModelClass.deleteOne({id: commentId})
            return comment
        }
    }

    async updateLikesInfo(
        commentId: string
    ) {
        const comment: commentDbModel | null = await CommentModelClass.findOne({id: commentId})

        if (!comment) {
            return false
        } else {
            await CommentModelClass.updateOne({id: commentId}, {
                $inc: {"likesInfo.likesCount": 1}
            })
            return comment
        }
    }

    async decreaseLikes(
        commentId: string
    ) {
        await CommentModelClass.updateOne({id: commentId}, {
            $inc: {"likesInfo.likesCount": -1}
        })
    }

    async updateDislikesInfo(
        commentId: string
    ) {
        const comment: commentDbModel | null = await CommentModelClass.findOne({id: commentId})

        if (!comment) {
            return false
        } else {
            await CommentModelClass.updateOne({id: commentId}, {
                $inc: {"likesInfo.dislikesCount": 1}
            })
            return comment
        }
    }

    async decreaseDislikes(
        commentId: string
    ) {
        await CommentModelClass.updateOne({id: commentId}, {
            $inc: {"likesInfo.dislikesCount": -1}
        })

    }
}
