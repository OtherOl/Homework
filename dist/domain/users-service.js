"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.usersService = exports.UsersService = void 0;
const users_repository_1 = require("../repositories/users-repository");
const crypto_1 = require("crypto");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const add_1 = __importDefault(require("date-fns/add"));
const email_manager_1 = require("../managers/email-manager");
const email_adapter_1 = require("../adapters/email-adapter");
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
let UsersService = class UsersService {
    constructor(usersRepository, emailAdapter) {
        this.usersRepository = usersRepository;
        this.emailAdapter = emailAdapter;
    }
    getAllUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersRepository.getAllUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm);
        });
    }
    createUser(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            const newUser = {
                _id: new mongodb_1.ObjectId(),
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
                recoveryConfirmation: {
                    recoveryCode: (0, uuid_1.v4)(),
                    expirationDate: (0, add_1.default)(new Date(), {
                        minutes: 1000
                    })
                },
                isConfirmed: true
            };
            return yield this.usersRepository.createUser(newUser);
        });
    }
    createUserForRegistration(login, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            const newUser = {
                _id: new mongodb_1.ObjectId(),
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
                recoveryConfirmation: {
                    recoveryCode: (0, uuid_1.v4)(),
                    expirationDate: (0, add_1.default)(new Date(), {
                        minutes: 1000
                    })
                },
                isConfirmed: false
            };
            const isExists = yield this.usersRepository.findByLoginOrEmail(email);
            if (isExists !== null)
                return "email exists";
            const isExistsLogin = yield this.usersRepository.findByLoginOrEmail(login);
            if (isExistsLogin !== null)
                return "login exists";
            yield email_manager_1.emailManager.sendEmailConfirmationCode(newUser);
            return yield this.usersRepository.createUser(newUser);
        });
    }
    createPasswordAndUpdate(id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            return yield this.usersRepository.updatePassword(id, passwordHash, passwordSalt);
        });
    }
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, salt);
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersRepository.deleteUser(id);
        });
    }
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield this.usersRepository.findByLoginOrEmail(loginOrEmail);
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
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.usersRepository.findUserById(userId);
        });
    }
    confirmEmail(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUserByConfirmationCode(code);
            if (user === null)
                return false;
            if (user.isConfirmed)
                return false;
            if (user.emailConfirmation.confirmationCode !== code)
                return false;
            if (user.emailConfirmation.expirationDate < new Date())
                return false;
            return yield this.usersRepository.updateConfirmation(user.id);
        });
    }
    confirmRecoveryCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findUserByRecoveryCode(code);
            if (user === null)
                return false;
            if (user.recoveryConfirmation.recoveryCode !== code)
                return false;
            if (user.recoveryConfirmation.expirationDate < new Date())
                return false;
            return user;
        });
    }
    resendConfirmation(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findByLoginOrEmail(email);
            if (user === null)
                return "User doesn't exists";
            if (user.isConfirmed)
                return "User already confirmed";
            const confirmationCode = (0, uuid_1.v4)();
            yield this.usersRepository.changeConfirmationCode(user.id, confirmationCode);
            yield this.emailAdapter.resendEmailConfirmationCode(email, confirmationCode);
            return true;
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        email_adapter_1.EmailAdapter])
], UsersService);
const usersRepo = new users_repository_1.UsersRepository();
const email = new email_adapter_1.EmailAdapter(usersRepo);
exports.usersService = new UsersService(usersRepo, email); // only for middlewares
