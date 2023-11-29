import {AuthRepository} from "./repositories/auth-repository";
import {AttemptsRepository} from "./repositories/attempts-repository";
import {BlogsRepository} from "./repositories/blogs-repository";
import {CommentsRepository} from "./repositories/comments-repository";
import {DevicesRepository} from "./repositories/devices-repository";
import {PostsRepository} from "./repositories/posts-repository";
import {UsersRepository} from "./repositories/users-repository";
import {BlogsService} from "./domain/blogs-service";
import {PostsService} from "./domain/posts-service";
import {CommentsService} from "./domain/comments-service";
import {UsersService} from "./domain/users-service";
import {EmailAdapter} from "./adapters/email-adapter";
import {DevicesService} from "./domain/devices-service";
import {AuthController} from "./controllers/auth-controller";
import {PostsController} from "./controllers/posts-controller";
import {CommentsController} from "./controllers/comments-controller";
import {SecurityController} from "./controllers/security-controller";
import {UsersController} from "./controllers/users-controller";
import {BlogsController} from "./controllers/blogs-controller";
import {LikesRepository} from "./repositories/likes-repository";
import {LikesService} from "./domain/likes-service";

const attemptsRepository = new AttemptsRepository()
const authRepository = new AuthRepository()
const blogsRepository = new BlogsRepository()
const commentsRepository = new CommentsRepository()
const devicesRepository = new DevicesRepository()
const postsRepository = new PostsRepository()
const usersRepository = new UsersRepository()
const likesRepository = new LikesRepository()

const emailAdapter = new EmailAdapter(usersRepository)
const blogsService = new BlogsService(blogsRepository)
const postsService = new PostsService(blogsRepository, postsRepository)
const commentsService = new CommentsService(commentsRepository)
const usersService = new UsersService(usersRepository, emailAdapter)
const devicesService = new DevicesService(devicesRepository)
const likesService = new LikesService(likesRepository, commentsRepository)

export const blogsController = new BlogsController(blogsService, postsService)
export const postsController = new PostsController(postsService)
export const commentsController = new CommentsController(commentsService, likesService)
export const securityController = new SecurityController(devicesRepository)
export const usersController = new UsersController(usersService)
export const authController = new AuthController(
    usersService, usersRepository, attemptsRepository,
    authRepository, devicesRepository, devicesService
)