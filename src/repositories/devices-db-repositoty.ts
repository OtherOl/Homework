import {devicesViewModel} from "../models/devices-model";
import {clientSecurityCollection} from "../data/DB-Mongo";

export const devicesRepository = {
    async addSession(
        inputData: devicesViewModel
    ) {
        return await clientSecurityCollection.insertOne({...inputData})
    },

    async getAllSessions(
        deviceId: string
    ) {
        return await clientSecurityCollection.find({deviceId: deviceId}, {projection: {_id: 0}}).toArray()
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
        return await clientSecurityCollection.updateOne({deviceId: id}, {$set: {deviceId: newId}})
    },
}