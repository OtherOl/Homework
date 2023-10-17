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
exports.usersRepository = void 0;
const DB_Mongo_1 = require("../data/DB-Mongo");
exports.usersRepository = {
    getAllUsers(sortBy = "createdAt", sortDirection = "desc", pageNumber, pageSize, searchLoginTerm, searchEmailTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            let sortQuery = {};
            sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;
            const filter = {
                $or: [
                    { login: RegExp(searchLoginTerm, "i") },
                    { email: RegExp(searchEmailTerm, "i") }
                ]
            };
            const countUsers = yield DB_Mongo_1.clientUserCollection.countDocuments(filter);
            const foundUsers = yield DB_Mongo_1.clientUserCollection
                .find(filter, { projection: { _id: 0, passwordHash: 0, passwordSalt: 0 } })
                .sort(sortQuery)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();
            const objects = {
                pagesCount: Math.ceil(countUsers / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: countUsers,
                items: foundUsers,
            };
            return objects;
        });
    },
    createUser(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield DB_Mongo_1.clientUserCollection.insertOne(Object.assign({}, inputData));
            return {
                id: inputData.id,
                login: inputData.login,
                email: inputData.email,
                createdAt: inputData.createdAt
            };
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedUser = yield DB_Mongo_1.clientUserCollection.deleteOne({ id: id });
            return deletedUser.deletedCount === 1;
        });
    },
    findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield DB_Mongo_1.clientUserCollection.findOne({
                $or: [
                    { login: loginOrEmail },
                    { email: loginOrEmail }
                ]
            });
            return foundUser;
        });
    },
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_Mongo_1.clientUserCollection.findOne({ id: userId });
        });
    }
};
