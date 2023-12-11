import {AuthModelClass} from "../data/DB-Mongo";
import {injectable} from "inversify";

@injectable()
export class AuthRepository {
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