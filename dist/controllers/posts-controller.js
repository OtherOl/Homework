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
exports.PostsController = void 0;
const jwt_service_1 = require("../application/jwt-service");
class PostsController {
    constructor(postsService, likesService, commentsService) {
        this.postsService = postsService;
        this.likesService = likesService;
        this.commentsService = commentsService;
    }
    getAllPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const allPosts = yield this.postsService.getAllPosts(req.query.sortBy, req.query.sortDirection, req.query.pageNumber ? +req.query.pageNumber : 1, req.query.pageSize ? +req.query.pageSize : 10);
            res.status(200).send(allPosts);
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content, blogId } = req.body;
            const newPost = yield this.postsService.createPost({ blogId, content, title, shortDescription });
            res.status(201).send(newPost);
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield this.postsService.getPostById(req.params.id);
            if (!foundPost) {
                res.sendStatus(404);
            }
            else {
                res.status(200).send(foundPost);
            }
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content, blogId } = req.body;
            const updatedPost = yield this.postsService.updatePost(req.params.id, req.body);
            if (updatedPost) {
                res.sendStatus(204);
            }
            else {
                res.sendStatus(404);
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const successDel = yield this.postsService.deletePost(req.params.id);
            if (!successDel) {
                res.sendStatus(404);
            }
            else {
                res.sendStatus(204);
            }
        });
    }
    createCommentForPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.postsService.createComment(req.params.id, req.body.content, req.user.id);
            if (!comment) {
                return res.sendStatus(404);
            }
            else {
                return res.status(201).send(comment);
            }
        });
    }
    getCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = req.headers.authorization;
            const userId = yield jwt_service_1.jwtService.getUserIdByToken(accessToken === null || accessToken === void 0 ? void 0 : accessToken.split(" ")[1]);
            const comment = yield this.postsService.getCommentById(req.params.id, req.query.pageNumber ? +req.query.pageNumber : 1, req.query.pageSize ? +req.query.pageSize : 10, req.query.sortBy, req.query.sortDirection, userId);
            if (!comment) {
                return res.sendStatus(404);
            }
            else {
                return res.status(200).send(comment);
            }
        });
    }
}
exports.PostsController = PostsController;
