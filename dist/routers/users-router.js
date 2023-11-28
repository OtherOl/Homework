"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const authorisation_middleware_1 = require("../middlewares/authorisation-middleware");
const body_user_validation_1 = require("../middlewares/body-user-validation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const compostion_root_1 = require("../compostion-root");
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter.get('/', compostion_root_1.usersControllerInstance.getAllUsers.bind(compostion_root_1.usersControllerInstance));
exports.usersRouter.post('/', authorisation_middleware_1.authorisationMiddleware, body_user_validation_1.bodyUserValidation.login, body_user_validation_1.bodyUserValidation.password, body_user_validation_1.bodyUserValidation.email, input_validation_middleware_1.inputValidationMiddleware, compostion_root_1.usersControllerInstance.createUser.bind(compostion_root_1.usersControllerInstance));
exports.usersRouter.delete('/:id', authorisation_middleware_1.authorisationMiddleware, compostion_root_1.usersControllerInstance.deleteUserById.bind(compostion_root_1.usersControllerInstance));
