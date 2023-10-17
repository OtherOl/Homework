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
exports.usersRouter = void 0;
const express_1 = require("express");
const users_service_1 = require("../domain/users-service");
const authorisation_middleware_1 = require("../middlewares/authorisation-middleware");
const body_user_validation_1 = require("../middlewares/body-user-validation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield users_service_1.usersService.getAllUsers(req.query.sortBy, req.query.sortDirection, req.query.pageNumber ? +req.query.pageNumber : 1, req.query.pageSize ? +req.query.pageSize : 10, req.query.searchLoginTerm, req.query.searchEmailTerm);
    res.status(200).send(allUsers);
}));
exports.usersRouter.post('/', authorisation_middleware_1.authorisationMiddleware, body_user_validation_1.bodyUserValidation.login, body_user_validation_1.bodyUserValidation.password, body_user_validation_1.bodyUserValidation.email, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdBlog = yield users_service_1.usersService.createUser(req.body.login, req.body.password, req.body.email);
    res.status(201).send(createdBlog);
}));
exports.usersRouter.delete('/:id', authorisation_middleware_1.authorisationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedUser = yield users_service_1.usersService.deleteUser(req.params.id);
    if (!deletedUser) {
        res.sendStatus(404);
    }
    else {
        res.sendStatus(204);
    }
}));
