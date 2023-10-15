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
exports.usersService = {
    getAllUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_db_repository_1.usersRepository.getAllUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm);
        });
    },
    createUser(login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, passwordSalt);
            const newUser = {
                id: (0, crypto_1.randomUUID)(),
                login: login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date().toISOString()
            };
            return users_db_repository_1.usersRepository.createUser(newUser);
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
            const passwordHash = yield this._generateHash(password, foundUser.passwordHash);
            return foundUser.passwordHash === passwordHash;
        });
    },
};
