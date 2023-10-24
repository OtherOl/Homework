import {usersRepository} from "../repositories/users-db-repository";
import {emailManager} from "../managers/email-manager";

export const emailAdapter = {
    async resendEmailConfirmationCode(
        email: string,
        code: string
    ) {
        const user = await usersRepository.findByLoginOrEmail(email)

        await emailManager.resendConfirmation(user!, code)
    }
}