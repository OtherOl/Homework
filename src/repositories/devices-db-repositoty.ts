import {devicesViewModel} from "../models/devices-model";
import {DeviceModelClass} from "../data/DB-Mongo";

export const devicesRepository = {
    async addSession(
        inputData: devicesViewModel
    ) {
        return await DeviceModelClass.create({...inputData})
    },

    async getAllSessions(
        userId: string
    ) {
        const session: devicesViewModel[] = await DeviceModelClass.find({userId: userId}).lean()
        return session.map(a => {
            const {_id, userId, ...rest} = a;
            return rest
        })
    },

    async getSessionById(
        deviceId: string
    ) {
        return DeviceModelClass.findOne({deviceId: deviceId})
    },

    async deleteSessions(
        deviceId: string
    ) {
        return DeviceModelClass.deleteMany({deviceId: {$ne: deviceId}})
    },

    async deleteSessionById(
        deviceId: string
    ) {
        const deleted = await DeviceModelClass.deleteOne({deviceId: deviceId})
        return deleted.deletedCount === 1
    },

    async updateSession(
        id: string
    ) {
        return DeviceModelClass.findOneAndUpdate({deviceId: id},
            {$set: {lastActiveDate: new Date().toISOString()}})
    },
}