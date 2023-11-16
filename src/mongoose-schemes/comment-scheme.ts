import mongoose from "mongoose";
import {commentDbModel} from "../models/comments-model";

export const commentScheme = new mongoose.Schema<commentDbModel>({
    id: String,
    content: {type: String, required: true},
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    createdAt: String
})