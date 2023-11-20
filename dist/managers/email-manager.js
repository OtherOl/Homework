"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailManager = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.emailManager = {
    sendEmailConfirmationCode(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    // user: process.env.EMAIL,
                    // pass: process.env.PASSWORD
                    user: 'dmitrybackenddev@gmail.com',
                    pass: 'tzcjafbdsjqrpmwl'
                }
            });
            yield transporter.sendMail({
                from: 'OtherOl BackEnd<dmitrybackenddev@gmail.com>',
                to: user.email,
                subject: "Confirmation code",
                html: "<h1>Thanks for your registration</h1>" +
                    `<p style="font-size: 18px;">To finish registration please enter cofirmation code:
                    <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>
                    "Confirm registration"</a></p>`,
            });
        });
    },
    sendCodeForPassword(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    // user: process.env.EMAIL,
                    // pass: process.env.PASSWORD
                    user: 'dmitrybackenddev@gmail.com',
                    pass: 'tzcjafbdsjqrpmwl'
                }
            });
            yield transporter.sendMail({
                from: 'OtherOl BackEnd<dmitrybackenddev@gmail.com>',
                to: user.email,
                subject: "Password recovery",
                html: "<h1>Password recovery</h1>" +
                    `<p style="font-size: 18px;">To finish password recovery please follow the link below:
                    <a href='https://homework-beta-sooty.vercel.app/password-recovery?recoveryCode=${user.recoveryConfirmation.recoveryCode}'>
                    recovery password</a></p>`,
            });
        });
    },
    resendConfirmation(user, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    // user: process.env.EMAIL,
                    // pass: process.env.PASSWORD
                    user: 'dmitrybackenddev@gmail.com',
                    pass: 'tzcjafbdsjqrpmwl'
                }
            });
            yield transporter.sendMail({
                from: 'OtherOl BackEnd<dmitrybackenddev@gmail.com>',
                to: user.email,
                subject: "Resending confirmation code",
                html: "<h1>Thanks for your registration</h1>" +
                    `<p style="font-size: 18px;">To finish registration please enter cofirmation code: 
                    <a href='https://somesite.com/confirm-email?code=${code}'>
                    "Confirm registration"</a>
                </p>`,
            });
        });
    }
};
