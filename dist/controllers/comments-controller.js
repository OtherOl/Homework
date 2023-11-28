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
exports.CommentsController = void 0;
const jwt_service_1 = require("../application/jwt-service");
class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    getCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsService.getCommentById(req.params.id);
            if (!comment) {
                res.sendStatus(404);
            }
            else {
                res.status(200).send(comment);
            }
        });
    }
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization.split(" ")[1];
            const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
            const updatedComment = yield this.commentsService.updateComment(req.params.id, req.body.content);
            if (!updatedComment) {
                res.sendStatus(404);
            }
            else if (updatedComment.commentatorInfo.userId !== userId) {
                res.sendStatus(403);
            }
            else {
                res.sendStatus(204);
            }
        });
    }
    deleteCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization.split(" ")[1];
            const userId = yield jwt_service_1.jwtService.getUserIdByToken(token);
            const comment = yield this.commentsService.deleteCommentById(req.params.commentId);
            if (!comment) {
                res.sendStatus(404);
            }
            else if (comment.commentatorInfo.userId !== userId) {
                res.sendStatus(403);
            }
            else {
                res.sendStatus(204);
            }
        });
    }
}
exports.CommentsController = CommentsController;
