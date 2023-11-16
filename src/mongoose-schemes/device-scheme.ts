import mongoose from "mongoose";
import {devicesViewModel} from "../models/devices-model";

export const deviceScheme = new mongoose.Schema<devicesViewModel>({
    ip: String,
    title: String,
    lastActiveDate: Date,
    deviceId: String,
    userId: String
})