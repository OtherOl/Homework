import mongoose from "mongoose";
import {PostDbModel} from "../models/post-model";

export const postScheme = new mongoose.Schema<PostDbModel>({
    id: String,
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: String,
    blogName: String,
    createdAt: String
}, {versionKey: false})