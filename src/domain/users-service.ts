import {usersRepository} from "../repositories/users-db-repository";
import {randomUUID} from "crypto";
import bcrypt from 'bcrypt'
import {userModel} from "../models/user-model";
import {paginationModel} from "../models/pagination-model";

export const usersService = {
    async getAllUsers(
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number,
        searchLoginTerm: string,
        searchEmailTerm: string
    ): Promise<paginationModel<userModel>> {
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
        email: string
    ) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser = {
            id: randomUUID(),
            login: login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString()
        }

        return usersRepository.createUser(newUser)
    },

    async _generateHash(
        password: string,
        salt: string
    ) {
        return await bcrypt.hash(password, salt)
    },

    async deleteUser(
        id: string
    ) {
        return await usersRepository.deleteUser(id)
    },

    async checkCredentials(
      loginOrEmail: string,
      password: string
    ) {
        const foundUser = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if(!foundUser) return false

        const passwordHash = await this._generateHash(password, foundUser.passwordHash)

        return foundUser.passwordHash === passwordHash;


    },
}