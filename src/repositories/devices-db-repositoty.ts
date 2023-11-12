import {devicesViewModel} from "../models/devices-model";
import {clientSecurityCollection} from "../data/DB-Mongo";

export const devicesRepository = {
    async addSession(
        inputData: devicesViewModel
    ) {
        return await clientSecurityCollection.insertOne({...inputData})
    },

    async getAllSessions(
        userId: string
    ) {
        return await clientSecurityCollection.find({userId: userId}, {projection: {_id: 0, userId: 0}}).toArray()
    },

    async getSessionById(
        deviceId: string
    ) {
        return await clientSecurityCollection.findOne({deviceId: deviceId}, {projection: {_id: 0}})
    },

    async deleteSessions(
        deviceId: string
    ) {
        return await clientSecurityCollection.deleteMany({deviceId: {$ne: deviceId}})
    },

    async deleteSessionById(
        deviceId: string
    ) {
        const deleted = await clientSecurityCollection.deleteOne({deviceId: deviceId})
        return deleted.deletedCount === 1
    },

    async updateSession(
        id: string,
        newId: string
    ) {
        return await clientSecurityCollection.findOneAndUpdate({deviceId: id}, {$set: {deviceId: newId, lastActiveDate: new Date().toISOString()}})
    },
}