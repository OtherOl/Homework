import {devicesViewModel} from "../models/devices-model";
import {DeviceModelClass} from "../data/DB-Mongo";

class DevicesRepository {
    async addSession(
        inputData: devicesViewModel
    ) {
        return await DeviceModelClass.create({...inputData})
    }

    async getAllSessions(
        userId: string
    ) {
        const session: devicesViewModel[] = await DeviceModelClass.find({userId: userId},
            {_id: 0, userId: 0}).lean()
        return session
    }

    async getSessionById(
        deviceId: string
    ) {
        return DeviceModelClass.findOne({deviceId: deviceId})
    }

    async deleteSessions(
        deviceId: string
    ) {
        return DeviceModelClass.deleteMany({deviceId: {$ne: deviceId}})
    }

    async deleteSessionById(
        deviceId: string
    ) {
        const deleted = await DeviceModelClass.deleteOne({deviceId: deviceId})
        return deleted.deletedCount === 1
    }

    async updateSession(
        id: string
    ) {
        return DeviceModelClass.findOneAndUpdate({deviceId: id},
            {$set: {lastActiveDate: new Date().toISOString()}})
    }
}

export const devicesRepository = new DevicesRepository()