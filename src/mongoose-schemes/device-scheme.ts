import mongoose from "mongoose";
import {devicesViewModel} from "../models/devices-model";

export const deviceScheme = new mongoose.Schema<devicesViewModel>({
    _id: {type: String, select: false},
    ip: String,
    title: String,
    lastActiveDate: Date,
    deviceId: String,
    userId: {type: String, select: false}
},
    {versionKey: false})