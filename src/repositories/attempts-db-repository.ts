import {clientAttemptCollection} from "../data/DB-Mongo";
import subSeconds from 'date-fns/subSeconds'

export const attemptsRepository = {
    async addAttempt(
        ip: string,
        url: string
    ) {
        await clientAttemptCollection.insertOne({
            IP: ip,
            URL: url,
            date: new Date()
        })
        return
    },

    async getAttemptsByIp(
        ip: string,
        url: string,
        date: any
    ) {
        return await clientAttemptCollection.countDocuments({IP: ip, URL: url, date: {$gt: subSeconds(date, 10)}})
    },
}