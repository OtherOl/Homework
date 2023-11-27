import {CommentsRepository} from "../repositories/comments-db-repository";

export class CommentsService {
    commentsRepository: CommentsRepository
    constructor() {
        this.commentsRepository = new CommentsRepository()
    }
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
}

// export const commentsService = new CommentsService()