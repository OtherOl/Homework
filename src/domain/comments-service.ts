import {CommentsRepository} from "../repositories/comments-repository";
import {likesModel} from "../models/likes-model";

export class CommentsService {
    constructor(protected commentsRepository: CommentsRepository) {}
    async getCommentById(
        id: string,
        like?: likesModel | null
    ) {
        if(like === null || !like) {
            return await this.commentsRepository.getCommentById(id, "None")
        } else {
            return await this.commentsRepository.getCommentById(id, like.type)
        }
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