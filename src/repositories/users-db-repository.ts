import {clientUserCollection} from "../data/DB-Mongo";
import {paginationModel} from "../models/pagination-model";
import {userModel} from "../models/user-model";

export const usersRepository = {
    async getAllUsers (
        sortBy: string = "createdAt",
        sortDirection: string = "desc",
        pageNumber: number,
        pageSize: number,
        searchLoginTerm: string,
        searchEmailTerm: string
    ) {
        let sortQuery: any = {}
        sortQuery[sortBy] = sortDirection === "asc"? 1 : -1

        const filter = {
            login: RegExp(searchLoginTerm, "i"),
            email: RegExp(searchEmailTerm, "i")
        }

        const countUsers: number = await clientUserCollection.countDocuments()
        const foundUsers: userModel[] = await clientUserCollection
            .find(filter, {projection: {_id: 0}})
            .sort(sortQuery)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray()

        const objects: paginationModel<userModel> = {
            pagesCount: Math.ceil(countUsers / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countUsers,
            items: foundUsers,
        }

        return objects
    },

    async createUser(
      inputData: userModel
    ) {
        const result = await clientUserCollection.insertOne({...inputData})

        return inputData
    },

    async deleteUser(
        id: string
    ) {
        const deletedUser = await clientUserCollection.deleteOne({id: id})

        return deletedUser.deletedCount === 1
    }
}