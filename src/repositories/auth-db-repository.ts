import {AuthModelClass} from "../data/DB-Mongo";

export const authRepository = {
    async blackList(
        token: string
    ) {
        return await AuthModelClass.create({token})
    },

    async findInvalidToken(
        token: string
    ) {
        return AuthModelClass.findOne({token: token})
    },
}