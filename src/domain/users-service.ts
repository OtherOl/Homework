import {UsersRepository} from "../repositories/users-repository";
import {randomUUID} from "crypto";
import bcrypt from 'bcrypt'
import {userViewModel} from "../models/user-model";
import {paginationModel} from "../models/pagination-model";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {emailManager} from "../managers/email-manager";
import {EmailAdapter} from "../adapters/email-adapter";
import {ObjectId} from "mongodb";

export class UsersService {
    constructor(
        protected usersRepository: UsersRepository,
        protected emailAdapter: EmailAdapter
    ) {}

    async getAllUsers(
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number,
        searchLoginTerm: string,
        searchEmailTerm: string
    ): Promise<paginationModel<userViewModel>> {
        return await this.usersRepository.getAllUsers(
            sortBy,
            sortDirection,
            pageNumber,
            pageSize,
            searchLoginTerm,
            searchEmailTerm
        )
    }

    async createUser(
        login: string,
        email: string,
        password: string
    ) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser = {
            _id: new ObjectId(),
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
            recoveryConfirmation: {
                recoveryCode: uuidv4(),
                expirationDate: add(new Date(), {
                    minutes: 1000
                })
            },
            isConfirmed: true
        }

        return await this.usersRepository.createUser(newUser)
    }

    async createUserForRegistration(
        login: string,
        email: string,
        password: string
    ) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const newUser = {
            _id: new ObjectId(),
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
            recoveryConfirmation: {
                recoveryCode: uuidv4(),
                expirationDate: add(new Date(), {
                    minutes: 1000
                })
            },
            isConfirmed: false
        }
        const isExists = await this.usersRepository.findByLoginOrEmail(email);
        if (isExists !== null) return "email exists"
        const isExistsLogin = await this.usersRepository.findByLoginOrEmail(login);
        if (isExistsLogin !== null) return "login exists"

        await emailManager.sendEmailConfirmationCode(newUser)
        return await this.usersRepository.createUser(newUser)
    }

    async createPasswordAndUpdate(
        id: string,
        password: string
    ) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        return await this.usersRepository.updatePassword(id, passwordHash, passwordSalt)
    }

    async _generateHash(
        password: string,
        salt: string
    ) {
        return await bcrypt.hash(password, salt)
    }

    async deleteUser(
        id: string
    ) {
        return await this.usersRepository.deleteUser(id)
    }

    async checkCredentials(
        loginOrEmail: string,
        password: string
    ) {
        const foundUser = await this.usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!foundUser) return false
        if (!foundUser.isConfirmed) return false

        const passwordHash = await this._generateHash(password, foundUser.passwordHash)

        if (foundUser.passwordHash !== passwordHash) {
            return false
        } else {
            return foundUser
        }
    }

    async findUserById(
        userId: any
    ) {
        return await this.usersRepository.findUserById(userId)
    }

    async confirmEmail(
        code: string
    ) {
        const user = await this.usersRepository.findUserByConfirmationCode(code)

        if (user === null) return false
        if (user.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false

        return await this.usersRepository.updateConfirmation(user.id)
    }

    async confirmRecoveryCode(
        code: string
    ) {
        const user = await this.usersRepository.findUserByRecoveryCode(code)

        if (user === null) return false
        if (user.recoveryConfirmation.recoveryCode !== code) return false
        if (user.recoveryConfirmation.expirationDate < new Date()) return false

        return user
    }

    async resendConfirmation(
        email: string
    ) {
        const user = await this.usersRepository.findByLoginOrEmail(email)

        if (user === null) return "User doesn't exists"
        if (user.isConfirmed) return "User already confirmed"

        const confirmationCode = uuidv4()

        await this.usersRepository.changeConfirmationCode(user.id, confirmationCode)

        await this.emailAdapter.resendEmailConfirmationCode(email, confirmationCode)

        return true
    }
}

const usersRepo = new UsersRepository()
const email = new EmailAdapter(usersRepo)
export const usersService = new UsersService(usersRepo, email) // only for middlewares
