import {clientCommentCollection} from "../data/DB-Mongo";

export const commentsRepository = {
    async getCommentById(
        id: string
    ) {
        const comment = await clientCommentCollection.findOne({id: id})

        if(!comment) {
            return false
        } else {
            return comment
        }
    }
}