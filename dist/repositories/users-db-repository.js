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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
            const countUsers = yield DB_Mongo_1.UserModelClass.countDocuments(filter);
            const foundUsers = yield DB_Mongo_1.UserModelClass
                .find(filter)
                .sort(sortQuery)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .lean();
            const modifiedUsers = foundUsers.map(user => {
                const { _id, passwordHash, passwordSalt, emailConfirmation, recoveryConfirmation, isConfirmed } = user, rest = __rest(user, ["_id", "passwordHash", "passwordSalt", "emailConfirmation", "recoveryConfirmation", "isConfirmed"]);
                return rest;
            });
            const objects = {
                pagesCount: Math.ceil(countUsers / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: countUsers,
                items: modifiedUsers,
            };
            return objects;
        });
    },
    createUser(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DB_Mongo_1.UserModelClass.create(Object.assign({}, inputData));
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
            const deletedUser = yield DB_Mongo_1.UserModelClass.deleteOne({ id: id });
            return deletedUser.deletedCount === 1;
        });
    },
    findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield DB_Mongo_1.UserModelClass.findOne({
                $or: [
                    { login: loginOrEmail },
                    { email: loginOrEmail }
                ]
            }).lean();
            return foundUser;
        });
    },
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.UserModelClass.findOne({ id: userId });
        });
    },
    findUserByConfirmationCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.UserModelClass.findOne({ "emailConfirmation.confirmationCode": code });
        });
    },
    findUserByRecoveryCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.UserModelClass.findOne({ "recoveryConfirmation.recoveryCode": code });
        });
    },
    updateConfirmation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield DB_Mongo_1.UserModelClass.updateOne({ id: id }, { $set: { isConfirmed: true } });
            return user.modifiedCount === 1;
        });
    },
    updatePassword(id, passwordHash, passwordSalt) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield DB_Mongo_1.UserModelClass.updateOne({ id: id }, { $set: { passwordHash, passwordSalt } });
            return user.modifiedCount === 1;
        });
    },
    changeConfirmationCode(id, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let newCode = yield DB_Mongo_1.UserModelClass.updateOne({ id: id }, { $set: { 'emailConfirmation.confirmationCode': code } });
            return newCode.modifiedCount === 1;
        });
    }
};
