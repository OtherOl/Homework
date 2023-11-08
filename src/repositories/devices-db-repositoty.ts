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
}