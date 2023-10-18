import {commentsRepository} from "../repositories/comments-db-repository";

export const commentsService = {
    async getCommentById(
        id: string
    ) {
        return await commentsRepository.getCommentById(id)
    },

    async updateComment(
      commentId: string,
      content: string,
    ) {
        return await commentsRepository.updateComment(
            commentId,
            content,
        )
    },

    async deleteCommentById(
        commentId: string
    ) {
        return await commentsRepository.deleteCommentById(commentId)
    },
}