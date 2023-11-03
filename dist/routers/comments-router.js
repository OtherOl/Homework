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
exports.commentsRouter = void 0;
const express_1 = require("express");
const comments_service_1 = require("../domain/comments-service");
const body_post_validation_1 = require("../middlewares/body-post-validation");
const input_validation_middleware_1 = require("../middlewares/input-validation-middleware");
const jwt_service_1 = require("../application/jwt-service");
exports.commentsRouter = (0, express_1.Router)({});
exports.commentsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield comments_service_1.commentsService.getCommentById(req.params.id);
    if (!comment) {
        res.sendStatus(404);
    }
    else {
        res.status(200).send(comment);
    }
}));
exports.commentsRouter.put('/:id', 
//authMiddleware,
body_post_validation_1.bodyPostValidation.comment, input_validation_middleware_1.inputValidationMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization.split(" ")[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
    const updatedComment = yield comments_service_1.commentsService.updateComment(req.params.id, req.body.content);
    if (!updatedComment) {
        res.sendStatus(404);
    }
    else if (updatedComment.commentatorInfo.userId !== userId) {
        res.sendStatus(403);
    }
    else {
        res.sendStatus(204);
    }
}));
exports.commentsRouter.delete('/:commentId', 
//authMiddleware,
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization.split(" ")[1];
    const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
    const comment = yield comments_service_1.commentsService.deleteCommentById(req.params.commentId);
    if (!comment) {
        res.sendStatus(404);
    }
    else if (comment.commentatorInfo.userId !== userId) {
        res.sendStatus(403);
    }
    else {
        res.sendStatus(204);
    }
}));
