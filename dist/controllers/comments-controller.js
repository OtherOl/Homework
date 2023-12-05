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
    constructor(commentsService, likesService, authRepository) {
        this.commentsService = commentsService;
        this.likesService = likesService;
        this.authRepository = authRepository;
    }
    getCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = req.headers.authorization;
            const comment = yield this.commentsService.getCommentById(req.params.id, accessToken);
            if (!comment) {
                return res.sendStatus(404);
            }
            else {
                return res.status(200).send(comment);
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
    doLikeDislike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = req.headers.authorization;
            const comment = yield this.commentsService.getCommentById(req.params.id, accessToken);
            const userId = yield jwt_service_1.jwtService.getUserIdByToken(accessToken === null || accessToken === void 0 ? void 0 : accessToken.split(" ")[1]);
            if (!comment)
                return res.sendStatus(404);
            if (req.body.likeStatus === "Like") {
                const like = yield this.likesService.getLikeByUserId(userId, comment.id);
                if (!like) {
                    const zeroLike = yield this.likesService.createZeroLike(userId);
                    yield this.likesService.createLike("Like", userId, comment.id, zeroLike);
                    return res.sendStatus(204);
                }
                else {
                    yield this.likesService.createLike("Like", userId, comment.id, like);
                    return res.sendStatus(204);
                }
            }
            if (req.body.likeStatus === "Dislike") {
                const like = yield this.likesService.getLikeByUserId(userId, comment.id);
                if (!like) {
                    const zeroLike = yield this.likesService.createZeroLike(userId);
                    yield this.likesService.createDislike("Dislike", userId, comment.id, zeroLike);
                    return res.sendStatus(204);
                }
                else {
                    yield this.likesService.createDislike("Dislike", userId, comment.id, like);
                    return res.sendStatus(204);
                }
            }
            if (req.body.likeStatus === "None") {
                const like = yield this.likesService.getLikeByUserId(userId, comment.id);
                if (!like) {
                    return res.sendStatus(204);
                }
                else if (like.type === "Like") {
                    yield this.likesService.setToNoneIfLike(like, "None");
                    return res.sendStatus(204);
                }
                else if (like.type === "Dislike") {
                    yield this.likesService.setToNoneIfDis(like, "None");
                    return res.sendStatus(204);
                }
                else if (like.type === "None") {
                    return res.sendStatus(204);
                }
            }
        });
    }
}
exports.CommentsController = CommentsController;
