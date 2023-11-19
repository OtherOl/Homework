import mongoose from "mongoose";
import {devicesViewModel} from "../models/devices-model";
import {ObjectId} from "mongodb";

export const deviceScheme = new mongoose.Schema<devicesViewModel>({
    _id: ObjectId,
    ip: String,
    title: String,
    lastActiveDate: Date,
    deviceId: String,
    userId: String
},
    {versionKey: false})