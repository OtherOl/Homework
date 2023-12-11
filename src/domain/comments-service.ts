import {CommentsRepository} from "../repositories/comments-repository";
import {jwtService} from "../application/jwt-service";
import {LikesService} from "./likes-service";
import {injectable} from "inversify";

@injectable()
export class CommentsService {
    constructor(
        private commentsRepository: CommentsRepository,
        private likesService: LikesService
    ) {
    }
    async getCommentById(
        id: string,
        accessToken: string | undefined
    ) {
        if (!accessToken) return await this.commentsRepository.getCommentById(id, "None")

        const userId = await jwtService.getUserIdByToken(accessToken.split(" ")[1])
        const like = await this.likesService.getLikeByUserIdComment(userId, id)

        if(!like) return await this.commentsRepository.getCommentById(id, "None")

        return await this.commentsRepository.getCommentById(id, like.type)
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