import mongoose from "mongoose";
import {commentDbModel} from "../models/comments-model";

export const commentScheme = new mongoose.Schema<commentDbModel>({
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
        myStatus: String
    }
}, {versionKey: false})