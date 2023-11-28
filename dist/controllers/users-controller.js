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
exports.UsersController = void 0;
class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield this.usersService.getAllUsers(req.query.sortBy, req.query.sortDirection, req.query.pageNumber ? +req.query.pageNumber : 1, req.query.pageSize ? +req.query.pageSize : 10, req.query.searchLoginTerm, req.query.searchEmailTerm);
            res.status(200).send(allUsers);
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdBlog = yield this.usersService.createUser(req.body.login, req.body.email, req.body.password);
            res.status(201).send(createdBlog);
        });
    }
    deleteUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedUser = yield this.usersService.deleteUser(req.params.id);
            if (!deletedUser) {
                res.sendStatus(404);
            }
            else {
                res.sendStatus(204);
            }
        });
    }
}
exports.UsersController = UsersController;
