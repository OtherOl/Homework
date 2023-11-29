import {CommentsRepository} from "../repositories/comments-repository";

export class CommentsService {
    constructor(protected commentsRepository: CommentsRepository) {}
    async getCommentById(
        id: string
    ) {
        return await this.commentsRepository.getCommentById(id)
    }

    async updateComment(
        commentId: string,
        content: string,
    ) {
        return await this.commentsRepository.updateComment(
            commentId,
            content,
        )
    }

    async deleteCommentById(
        commentId: string
    ) {
        return await this.commentsRepository.deleteCommentById(commentId)
    }

    async updateLikesForComment(
        commentId: string,
        type: string,
        userId: string
    ) {

    }
}