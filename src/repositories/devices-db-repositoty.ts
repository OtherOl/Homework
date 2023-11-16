import {devicesViewModel} from "../models/devices-model";
import {DeviceModel} from "../data/DB-Mongo";

export const devicesRepository = {
    async addSession(
        inputData: devicesViewModel
    ) {
        return await DeviceModel.create({...inputData})
    },

    async getAllSessions(
        userId: string
    ) {
        return DeviceModel.find({userId: userId}, {projection: {_id: 0, userId: 0}}).lean()
    },

    async getSessionById(
        deviceId: string
    ) {
        return DeviceModel.findOne({deviceId: deviceId}, {projection: {_id: 0}})
    },

    async deleteSessions(
        deviceId: string
    ) {
        return DeviceModel.deleteMany({deviceId: {$ne: deviceId}})
    },

    async deleteSessionById(
        deviceId: string
    ) {
        const deleted = await DeviceModel.deleteOne({deviceId: deviceId})
        return deleted.deletedCount === 1
    },

    async updateSession(
        id: string
    ) {
        return DeviceModel.findOneAndUpdate({deviceId: id},
            {$set: {lastActiveDate: new Date().toISOString()}}, {projection: {_id: 0}})
    },
}