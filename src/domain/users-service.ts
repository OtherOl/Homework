import {usersRepository} from "../repositories/users-db-repository";
import {randomUUID} from "crypto";

export const usersService = {
    async getAllUsers(
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number,
        searchLoginTerm: string,
        searchEmailTerm: string
    ) {
        return await usersRepository.getAllUsers(
            sortBy,
            sortDirection,
            pageNumber,
            pageSize,
            searchLoginTerm,
            searchEmailTerm
        )
    },

    async createUser(
        login: string,
        password: string,
        email:string
    ) {
        const newUser = {
            id: randomUUID(),
            login: login,
            password: password,
            email: email,
            createdAt: new Date().toISOString()
        }

        return usersRepository.createUser(newUser)
    },

    async deleteUser(
        id: string
    ) {
        return await usersRepository.deleteUser(id)
    }
}