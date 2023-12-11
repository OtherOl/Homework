"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const auth_repository_1 = require("./repositories/auth-repository");
const attempts_repository_1 = require("./repositories/attempts-repository");
const blogs_repository_1 = require("./repositories/blogs-repository");
const comments_repository_1 = require("./repositories/comments-repository");
const devices_repository_1 = require("./repositories/devices-repository");
const posts_repository_1 = require("./repositories/posts-repository");
const users_repository_1 = require("./repositories/users-repository");
const blogs_service_1 = require("./domain/blogs-service");
const posts_service_1 = require("./domain/posts-service");
const comments_service_1 = require("./domain/comments-service");
const users_service_1 = require("./domain/users-service");
const email_adapter_1 = require("./adapters/email-adapter");
const devices_service_1 = require("./domain/devices-service");
const auth_controller_1 = require("./controllers/auth-controller");
const posts_controller_1 = require("./controllers/posts-controller");
const comments_controller_1 = require("./controllers/comments-controller");
const security_controller_1 = require("./controllers/security-controller");
const users_controller_1 = require("./controllers/users-controller");
const blogs_controller_1 = require("./controllers/blogs-controller");
const likes_repository_1 = require("./repositories/likes-repository");
const likes_service_1 = require("./domain/likes-service");
const inversify_1 = require("inversify");
// const attemptsRepository = new AttemptsRepository()
// const authRepository = new AuthRepository()
// const blogsRepository = new BlogsRepository()
// const commentsRepository = new CommentsRepository()
// const devicesRepository = new DevicesRepository()
// const postsRepository = new PostsRepository()
// const usersRepository = new UsersRepository()
// const likesRepository = new LikesRepository()
//
// const emailAdapter = new EmailAdapter(usersRepository)
// const blogsService = new BlogsService(blogsRepository)
// const postsService = new PostsService(blogsRepository, postsRepository, likesRepository)
// const usersService = new UsersService(usersRepository, emailAdapter)
// const devicesService = new DevicesService(devicesRepository)
// const likesService = new LikesService(likesRepository, commentsRepository, postsService)
// const commentsService = new CommentsService(commentsRepository, likesService)
//
// export const blogsController = new BlogsController(blogsService, postsService)
// export const postsController = new PostsController(postsService, likesService, commentsService, usersService)
// export const commentsController = new CommentsController(commentsService, likesService, authRepository)
// export const securityController = new SecurityController(devicesRepository)
// export const usersController = new UsersController(usersService)
// export const authController = new AuthController(
//     usersService, usersRepository, attemptsRepository,
//     authRepository, devicesRepository, devicesService
// )
exports.container = new inversify_1.Container();
exports.container.bind(blogs_controller_1.BlogsController).to(blogs_controller_1.BlogsController);
exports.container.bind(posts_controller_1.PostsController).to(posts_controller_1.PostsController);
exports.container.bind(comments_controller_1.CommentsController).to(comments_controller_1.CommentsController);
exports.container.bind(security_controller_1.SecurityController).to(security_controller_1.SecurityController);
exports.container.bind(users_controller_1.UsersController).to(users_controller_1.UsersController);
exports.container.bind(auth_controller_1.AuthController).to(auth_controller_1.AuthController);
exports.container.bind(email_adapter_1.EmailAdapter).to(email_adapter_1.EmailAdapter);
exports.container.bind(blogs_service_1.BlogsService).to(blogs_service_1.BlogsService);
exports.container.bind(posts_service_1.PostsService).to(posts_service_1.PostsService);
exports.container.bind(users_service_1.UsersService).to(users_service_1.UsersService);
exports.container.bind(devices_service_1.DevicesService).to(devices_service_1.DevicesService);
exports.container.bind(likes_service_1.LikesService).to(likes_service_1.LikesService);
exports.container.bind(comments_service_1.CommentsService).to(comments_service_1.CommentsService);
exports.container.bind(attempts_repository_1.AttemptsRepository).to(attempts_repository_1.AttemptsRepository);
exports.container.bind(auth_repository_1.AuthRepository).to(auth_repository_1.AuthRepository);
exports.container.bind(blogs_repository_1.BlogsRepository).to(blogs_repository_1.BlogsRepository);
exports.container.bind(comments_repository_1.CommentsRepository).to(comments_repository_1.CommentsRepository);
exports.container.bind(devices_repository_1.DevicesRepository).to(devices_repository_1.DevicesRepository);
exports.container.bind(posts_repository_1.PostsRepository).to(posts_repository_1.PostsRepository);
exports.container.bind(users_repository_1.UsersRepository).to(users_repository_1.UsersRepository);
exports.container.bind(likes_repository_1.LikesRepository).to(likes_repository_1.LikesRepository);
