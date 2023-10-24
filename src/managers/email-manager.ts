import {createNewUserModel} from "../models/user-model";
import nodemailer from "nodemailer";

export const emailManager = {
    async sendEmailConfirmationCode(
        user: createNewUserModel
    ) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dmitrybackenddev@gmail.com',
                pass: 'tzcjafbdsjqrpmwl'
            }
        })

        let info = await transporter.sendMail({
            from: 'OtherOl BackEnd<dmitrybackenddev@gmail.com>',
            to: user.email,
            subject: "Confirmation code",
            html: "<h1>Thanks for your registration</h1>" +
                `<p style="font-size: 18px;">To finish registration please enter cofirmation code:
                    <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>
                    "Confirm registration"</a></p>`, // html body
        })
    },

    async resendConfirmation(
        user: createNewUserModel
    ) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dmitrybackenddev@gmail.com',
                pass: 'tzcjafbdsjqrpmwl'
            }
        })

        let info = await transporter.sendMail({
            from: 'OtherOl BackEnd<dmitrybackenddev@gmail.com>',
            to: user.email,
            subject: "Resending confirmation code",
            html: "<h1>Thanks for your registration</h1>" +
                `<p style="font-size: 18px;">To finish registration please enter cofirmation code: 
                    <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>
                    "Confirm registration"</a>
                </p>`,
        })
    }
}