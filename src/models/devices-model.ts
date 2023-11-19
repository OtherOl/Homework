import {ObjectId} from "mongodb";

export type devicesViewModel = {
    _id: ObjectId
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
    userId: string
}