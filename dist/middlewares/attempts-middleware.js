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
exports.attemptsMiddleware = void 0;
const attempts_db_repository_1 = require("../repositories/attempts-db-repository");
const attemptsMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ip = req.ip;
    const url = req.originalUrl;
    const date = new Date();
    const attempts = yield attempts_db_repository_1.attemptsRepository.getAttemptsByIp(ip, url, date);
    if (attempts > 4) {
        return res.sendStatus(429);
    }
    else {
        next();
        return;
    }
});
exports.attemptsMiddleware = attemptsMiddleware;
