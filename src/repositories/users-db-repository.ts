import {clientUserCollection} from "../data/DB-Mongo";
import {paginationModel} from "../models/pagination-model";
import {createUserModel, userModel, userViewModel} from "../models/user-model";

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

        const countUsers: number = await clientUserCollection.countDocuments()
        const foundUsers: userViewModel[] = await clientUserCollection
            .find(filter, {projection: {_id: 0}})
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
        inputData: createUserModel
    ) {
        const result = await clientUserCollection.insertOne({...inputData})

        return inputData
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
        return await clientUserCollection.findOne({
            $or:
                [
                    {login: RegExp(loginOrEmail, "i")},
                    {email: RegExp(loginOrEmail, "i")}
                ]
        })

    },
}