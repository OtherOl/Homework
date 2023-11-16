import mongoose from "mongoose";
import {blogModel} from "../models/blog-model";

export const blogScheme = new mongoose.Schema<blogModel>({
    id: String,
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: String,
    isMembership: Boolean
})