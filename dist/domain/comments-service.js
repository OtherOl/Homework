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
class CommentsService {
    constructor(commentsRepository) {
        this.commentsRepository = commentsRepository;
    }
    getCommentById(id, like) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!like) {
                return yield this.commentsRepository.getCommentById(id, "None");
            }
            else {
                return yield this.commentsRepository.getCommentById(id, like.type);
            }
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
