import mongoose from "mongoose";
import {commentDbModel} from "../models/comments-model";

export const commentScheme = new mongoose.Schema<commentDbModel>({
    postId: String,
    id: String,
    content: {type: String, required: true},
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    createdAt: String,
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String,
        likesList: []
    }
}, {versionKey: false})