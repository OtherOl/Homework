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
exports.PostsService = void 0;
const crypto_1 = require("crypto");
const posts_repository_1 = require("../repositories/posts-repository");
const blogs_repository_1 = require("../repositories/blogs-repository");
const jwt_service_1 = require("../application/jwt-service");
const likes_repository_1 = require("../repositories/likes-repository");
const inversify_1 = require("inversify");
let PostsService = class PostsService {
    constructor(blogsRepository, postsRepository, likesRepository) {
        this.blogsRepository = blogsRepository;
        this.postsRepository = postsRepository;
        this.likesRepository = likesRepository;
    }
    getAllPosts(sortBy, sortDirection, pageNumber, pageSize, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.getAllPosts(sortBy, sortDirection, pageNumber, pageSize, userId);
        });
    }
    getPostById(id, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!accessToken)
                return yield this.postsRepository.getPostById(id, "None");
            const userId = yield jwt_service_1.jwtService.getUserIdByToken(accessToken.split(" ")[1]);
            const like = yield this.likesRepository.getLikeInfoPost(userId, id);
            if (!like)
                return yield this.postsRepository.getPostById(id, "None");
            return yield this.postsRepository.getPostById(id, like.type);
        });
    }
    createPost(inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsRepository.getBlogById(inputData.blogId);
            if (!blog)
                return null;
            const newPost = {
                id: (0, crypto_1.randomUUID)(),
                title: inputData.title,
                shortDescription: inputData.shortDescription,
                content: inputData.content,
                blogId: blog.id,
                blogName: blog.name,
                createdAt: new Date().toISOString(),
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None",
                    newestLikes: []
                }
            };
            yield this.postsRepository.createPost(newPost);
            return newPost;
        });
    }
    updatePost(id, inputData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.updatePost(id, inputData);
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.deletePost(id);
        });
    }
    createComment(id, content, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.createComment(id, content, userId);
        });
    }
    getCommentById(postId, pageNumber, pageSize, sortBy, sortDirection, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.getCommentById(postId, pageNumber, pageSize, sortBy, sortDirection, userId);
        });
    }
    updateLikesInfo(postId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.updateLikesInfo(postId, type);
        });
    }
    decreaseLikes(postId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postsRepository.decreaseLikes(postId, type);
        });
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository,
        posts_repository_1.PostsRepository,
        likes_repository_1.LikesRepository])
], PostsService);
