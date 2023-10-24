import {clientUserCollection} from "../data/DB-Mongo";
import {paginationModel} from "../models/pagination-model";
import {createNewUserModel, userViewModel} from "../models/user-model";
import {v4 as uuidv4} from 'uuid';

export const usersRepository = {
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

        const countUsers: number = await clientUserCollection.countDocuments(filter)
        const foundUsers: userViewModel[] = await clientUserCollection
            .find(filter, {projection: {_id: 0, passwordHash: 0, passwordSalt: 0, emailConfirmation: 0}})
            .sort(sortQuery)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const objects: paginationModel<userViewModel> = {
            pagesCount: Math.ceil(countUsers / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countUsers,
            items: foundUsers,
        }

        return objects
    },

    async createUser(
        inputData: createNewUserModel
    ) {
        await clientUserCollection.insertOne({...inputData})

        return {
            id: inputData.id,
            login: inputData.login,
            email: inputData.email,
            createdAt: inputData.createdAt
        }
    },

    async deleteUser(
        id: string
    ) {
        const deletedUser = await clientUserCollection.deleteOne({id: id})

        return deletedUser.deletedCount === 1
    },

    async findByLoginOrEmail(
        loginOrEmail: string
    ) {
        const foundUser: createNewUserModel | null = await clientUserCollection.findOne({
            $or:
                [
                    {login: loginOrEmail},
                    {email: loginOrEmail}
                ]
        })
        return foundUser
    },

    async findUserById(
        userId: string
    ) {
        return await clientUserCollection.findOne({id: userId})
    },

    async findUserByConfirmationCode(
        code: string
    ) {
        return await clientUserCollection.findOne({"emailConfirmation.confirmationCode": code})
    },

    async updateConfirmation(
        id: string
    ) {
        const user = await clientUserCollection.updateOne({id: id}, {$set: {isConfirmed: true}})

        return user.modifiedCount === 1
    },

    async updateCode(
        id: string
    ) {
        return await clientUserCollection.findOneAndUpdate({id: id}, {$set: {"emailConfirmation.confirmationCode": uuidv4()}})
    }
}