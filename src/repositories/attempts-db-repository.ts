import {AttemptModelClass} from "../data/DB-Mongo";
import subSeconds from 'date-fns/subSeconds'

class AttemptsDbRepository {
    async addAttempt(
        ip: string,
        url: string
    ) {
        await AttemptModelClass.create({
            IP: ip,
            URL: url,
            date: new Date()
        })
        return
    }

    async getAttemptsByIp(
        ip: string,
        url: string,
        date: any
    ) {
        return AttemptModelClass.countDocuments({IP: ip, URL: url, date: {$gt: subSeconds(date, 10)}})
    }
}

export const attemptsRepository = new AttemptsDbRepository()