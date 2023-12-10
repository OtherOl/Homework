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
exports.PostsService = void 0;
const crypto_1 = require("crypto");
const jwt_service_1 = require("../application/jwt-service");
class PostsService {
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
                    newestLikes: [
                        {
                            addedAt: "",
                            userId: "",
                            login: ""
                        }
                    ]
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
}
exports.PostsService = PostsService;
