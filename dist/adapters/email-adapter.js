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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAdapter = void 0;
const email_manager_1 = require("../managers/email-manager");
class EmailAdapter {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    resendEmailConfirmationCode(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findByLoginOrEmail(email);
            yield email_manager_1.emailManager.resendConfirmation(user, code);
        });
    }
}
exports.EmailAdapter = EmailAdapter;
