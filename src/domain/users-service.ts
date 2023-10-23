import {usersRepository} from "../repositories/users-db-repository";
import {randomUUID} from "crypto";
import bcrypt from 'bcrypt'
import {userViewModel} from "../models/user-model";
import {paginationModel} from "../models/pagination-model";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'

export const usersService = {
    async getAllUsers(
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number,
        searchLoginTerm: string,
        searchEmailTerm: string
    ): Promise<paginationModel<userViewModel>> {
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
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    minutes: 3
                })
            },
            isConfirmed: false
        }
        // there should be emailsManager.sendEmail
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
        if (!foundUser) return false

        const passwordHash = await this._generateHash(password, foundUser.passwordHash)

        if (foundUser.passwordHash !== passwordHash) {
            return false
        } else {
            return foundUser
        }
    },

    async findUserById(
        userId: any
    ) {
        return await usersRepository.findUserById(userId)
    },
}