import {commentsRepository} from "../repositories/comments-db-repository";

export const commentsService = {
    async getCommentById(
        id: string
    ) {
        return await commentsRepository.getCommentById(id)
    },
}