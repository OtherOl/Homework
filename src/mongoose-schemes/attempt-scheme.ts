import mongoose from "mongoose";

export const attemptScheme = new mongoose.Schema({
    IP: String,
    URL: String,
    date: Date
})