import {AuthModelClass} from "../data/DB-Mongo";

class AuthRepository {
    async blackList(
        token: string
    ) {
        return await AuthModelClass.create({token})
    }

    async findInvalidToken(
        token: string
    ) {
        return AuthModelClass.findOne({token: token})
    }
}

export const authRepository = new AuthRepository()