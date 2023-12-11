"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const comments_repository_1 = require("../repositories/comments-repository");
const jwt_service_1 = require("../application/jwt-service");
const likes_service_1 = require("./likes-service");
const inversify_1 = require("inversify");
let CommentsService = class CommentsService {
    constructor(commentsRepository, likesService) {
        this.commentsRepository = commentsRepository;
        this.likesService = likesService;
    }
    getCommentById(id, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!accessToken)
                return yield this.commentsRepository.getCommentById(id, "None");
            const userId = yield jwt_service_1.jwtService.getUserIdByToken(accessToken.split(" ")[1]);
            const like = yield this.likesService.getLikeByUserIdComment(userId, id);
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
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [comments_repository_1.CommentsRepository,
        likes_service_1.LikesService])
], CommentsService);
