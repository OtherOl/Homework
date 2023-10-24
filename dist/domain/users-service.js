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
exports.usersService = void 0;
const users_db_repository_1 = require("../repositories/users-db-repository");
const crypto_1 = require("crypto");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
const email_manager_1 = require("../managers/email-manager");
exports.usersService = {
    getAllUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_db_repository_1.usersRepository.getAllUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm);
        });
    },
    createUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            const newUser = {
                id: (0, crypto_1.randomUUID)(),
                login: login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date().toISOString(),
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, add_1.default)(new Date(), {
                        minutes: 3
                    })
                },
                isConfirmed: false
            };
            const isExists = yield users_db_repository_1.usersRepository.findByLoginOrEmail(email);
            if (isExists !== null)
                return "email exists";
            const isExistsLogin = yield users_db_repository_1.usersRepository.findByLoginOrEmail(login);
            if (isExistsLogin !== null)
                return "login exists";
            yield email_manager_1.emailManager.sendEmailConfirmationCode(newUser);
            return yield users_db_repository_1.usersRepository.createUser(newUser);
        });
    },
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, salt);
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_db_repository_1.usersRepository.deleteUser(id);
        });
    },
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield users_db_repository_1.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (!foundUser)
                return false;
            if (!foundUser.isConfirmed)
                return false;
            const passwordHash = yield this._generateHash(password, foundUser.passwordHash);
            if (foundUser.passwordHash !== passwordHash) {
                return false;
            }
            else {
                return foundUser;
            }
        });
    },
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_db_repository_1.usersRepository.findUserById(userId);
        });
    },
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_repository_1.usersRepository.findUserByConfirmationCode(code);
            if (user === null)
                return false;
            if (user.isConfirmed)
                return false;
            if (user.emailConfirmation.confirmationCode !== code)
                return false;
            if (user.emailConfirmation.expirationDate < new Date())
                return false;
            return yield users_db_repository_1.usersRepository.updateConfirmation(user.id);
        });
    },
    resendConfirmation(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_repository_1.usersRepository.findByLoginOrEmail(email);
            if (user === null)
                return "User doesn't exists";
            if (user.isConfirmed)
                return "User already confirmed";
            const newCode = yield users_db_repository_1.usersRepository.updateCode(user.id);
            yield email_manager_1.emailManager.resendConfirmation(newCode);
            return true;
        });
    }
};
