"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const authorisation_middleware_1 = require("../middlewares/authorisation-middleware");
const body_user_validation_1 = require("../middlewares/body-user-validation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const compostion_root_1 = require("../compostion-root");
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter.get('/', compostion_root_1.usersController.getAllUsers.bind(compostion_root_1.usersController));
exports.usersRouter.post('/', authorisation_middleware_1.authorisationMiddleware, body_user_validation_1.bodyUserValidation.login, body_user_validation_1.bodyUserValidation.password, body_user_validation_1.bodyUserValidation.email, input_validation_middleware_1.inputValidationMiddleware, compostion_root_1.usersController.createUser.bind(compostion_root_1.usersController));
exports.usersRouter.delete('/:id', authorisation_middleware_1.authorisationMiddleware, compostion_root_1.usersController.deleteUserById.bind(compostion_root_1.usersController));
