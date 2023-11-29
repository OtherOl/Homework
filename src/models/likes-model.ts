import {ObjectId} from "mongodb";

export type likesModel = {
    _id: ObjectId,
    type: string,
    userId: string,
    commentId: string
}