import {UsersRepository} from "../repositories/users-repository";
import {emailManager} from "../managers/email-manager";
import {injectable} from "inversify";

@injectable()
export class EmailAdapter {
    constructor(protected usersRepository: UsersRepository) {}
    async resendEmailConfirmationCode(
        email: string,
        code: string
    ) {
        const user = await this.usersRepository.findByLoginOrEmail(email)

        await emailManager.resendConfirmation(user!, code)
    }
}