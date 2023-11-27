import {UsersRepository} from "../repositories/users-repository";
import {emailManager} from "../managers/email-manager";

export class EmailAdapter {
    usersRepository: UsersRepository
    constructor() {
        this.usersRepository = new UsersRepository()
    }
    async resendEmailConfirmationCode(
        email: string,
        code: string
    ) {
        const user = await this.usersRepository.findByLoginOrEmail(email)

        await emailManager.resendConfirmation(user!, code)
    }
}