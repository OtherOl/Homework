import {AuthModel} from "../data/DB-Mongo";

export const authRepository = {
    async blackList(
        token: string
    ) {
        return await AuthModel.create({token})
    },

    async findInvalidToken(
        token: string
    ) {
        return AuthModel.findOne({token: token})
    },
}