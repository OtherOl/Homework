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
exports.attemptsRepository = void 0;
const DB_Mongo_1 = require("../data/DB-Mongo");
exports.attemptsRepository = {
    addAttempt(ip, url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DB_Mongo_1.clientAttemptCollection.insertOne({
                IP: ip,
                URL: url,
                date: new Date()
            });
            return;
        });
    },
    // async getAttempts() {
    //   return await clientAttemptCollection.find({}, {projection: {_id: 0}}).toArray()
    // },
    getAttemptsByIp(ip, url, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_Mongo_1.clientAttemptCollection.countDocuments({ IP: ip, URL: url, date: { $gte: new Date(date - 10000) } });
        });
    },
};
