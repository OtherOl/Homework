import {clientAuthCollection} from "../data/DB-Mongo";

export const authRepository = {
    async blackList(
        token: string
    ) {
        return await clientAuthCollection.insertOne({token})
    },

    async findInvalidToken(
        token: string
    ) {
        return await clientAuthCollection.findOne({token: token})
    },
}