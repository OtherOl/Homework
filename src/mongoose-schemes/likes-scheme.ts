import mongoose from "mongoose";
import {likesModel} from "../models/likes-model";
import {ObjectId} from "mongodb";

export const likesScheme = new mongoose.Schema<likesModel>({
    _id: ObjectId,
    type: String,
    userId: String,
    commentId: String,
})