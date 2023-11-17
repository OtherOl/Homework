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
exports.attemptsRepository = void 0;
const DB_Mongo_1 = require("../data/DB-Mongo");
const subSeconds_1 = __importDefault(require("date-fns/subSeconds"));
exports.attemptsRepository = {
    addAttempt(ip, url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DB_Mongo_1.AttemptModelClass.create({
                IP: ip,
                URL: url,
                date: new Date()
            });
            return;
        });
    },
    getAttemptsByIp(ip, url, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return DB_Mongo_1.AttemptModelClass.countDocuments({ IP: ip, URL: url, date: { $gt: (0, subSeconds_1.default)(date, 10) } });
        });
    },
};
