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
exports.CommentsService = void 0;
const jwt_service_1 = require("../application/jwt-service");
class CommentsService {
    constructor(commentsRepository, likesService) {
        this.commentsRepository = commentsRepository;
        this.likesService = likesService;
    }
    getCommentById(id, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!accessToken)
                return yield this.commentsRepository.getCommentById(id, "None");
            const userId = yield jwt_service_1.jwtService.getUserIdByToken(accessToken.split(" ")[1]);
            const like = yield this.likesService.getLikeByUserId(userId, id);
            if (!like)
                return yield this.commentsRepository.getCommentById(id, "None");
            return yield this.commentsRepository.getCommentById(id, like.type);
        });
    }
    updateComment(commentId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.commentsRepository.updateComment(commentId, content);
        });
    }
    deleteCommentById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.commentsRepository.deleteCommentById(commentId);
        });
    }
}
exports.CommentsService = CommentsService;
