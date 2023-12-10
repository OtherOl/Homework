import {ObjectId} from "mongodb";

export type likesCommentModel = {
    _id: ObjectId,
    type: string,
    userId: string,
    commentId: string,
    addedAt: string
}

export type likesPostModel = {
    _id: ObjectId,
    type: string,
    userId: string,
    postId: string,
    addedAt: string,
    login: string
}

export type likesModel = {
    _id: ObjectId,
    type: string,
    userId: string,
    commentId: string,
    postId: string,
    addedAt: string,
    login: string
}