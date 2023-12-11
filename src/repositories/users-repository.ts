import {UserModelClass} from "../data/DB-Mongo";
import {paginationModel} from "../models/pagination-model";
import {createNewUserModel, userViewModel} from "../models/user-model";
import {injectable} from "inversify";

@injectable()
export class UsersRepository {
    async getAllUsers(
        sortBy: string = "createdAt",
        sortDirection: string = "desc",
        pageNumber: number,
        pageSize: number,
        searchLoginTerm: string,
        searchEmailTerm: string
    ) {
        let sortQuery: any = {}
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1

        const filter = {
            $or:
                [
                    {login: RegExp(searchLoginTerm, "i")},
                    {email: RegExp(searchEmailTerm, "i")}
                ]
        }

        const countUsers: number = await UserModelClass.countDocuments(filter)
        const foundUsers: createNewUserModel[] = await UserModelClass
            .find(filter, {_id: 0, passwordHash: 0, passwordSalt: 0,
                emailConfirmation: 0, recoveryConfirmation: 0, isConfirmed: 0})
            .sort(sortQuery)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        const objects: paginationModel<userViewModel> = {
            pagesCount: Math.ceil(countUsers / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countUsers,
            items: foundUsers,
        }

        return objects
    }

    async createUser(
        inputData: createNewUserModel
    ) {
        await UserModelClass.create({...inputData})

        return {
            id: inputData.id,
            login: inputData.login,
            email: inputData.email,
            createdAt: inputData.createdAt
        }
    }

    async deleteUser(
        id: string
    ) {
        const deletedUser = await UserModelClass.deleteOne({id: id})

        return deletedUser.deletedCount === 1
    }

    async findByLoginOrEmail(
        loginOrEmail: string
    ) {
        const foundUser: createNewUserModel | null = await UserModelClass.findOne({
            $or:
                [
                    {login: loginOrEmail},
                    {email: loginOrEmail}
                ]
        }).lean()
        return foundUser
    }

    async findUserById(
        userId: string
    ) {
        return UserModelClass.findOne({id: userId})
    }

    async findUserByConfirmationCode(
        code: string
    ) {
        return UserModelClass.findOne({"emailConfirmation.confirmationCode": code})
    }

    async findUserByRecoveryCode(
        code: string
    ) {
        return UserModelClass.findOne({"recoveryConfirmation.recoveryCode": code})
    }

    async updateConfirmation(
        id: string
    ) {
        const user = await UserModelClass.updateOne({id: id}, {$set: {isConfirmed: true}})

        return user.modifiedCount === 1
    }

    async updatePassword(
        id: string,
        passwordHash: any,
        passwordSalt: any
    ) {
        const user = await UserModelClass.updateOne({id: id}, {$set: {passwordHash, passwordSalt}})

        return user.modifiedCount === 1
    }

    async changeConfirmationCode(
        id: string,
        code: string
    ) {
        let newCode = await UserModelClass.updateOne({id: id}, {$set: {'emailConfirmation.confirmationCode': code}})

        return newCode.modifiedCount === 1
    }
}
