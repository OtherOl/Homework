import {AuthRepository} from "./repositories/auth-db-repository";
// import {AuthController} from "./routers/auth-router";
import {AttemptsRepository} from "./repositories/attempts-db-repository";
import {BlogsRepository} from "./repositories/blogs-db-repository";
import {CommentsRepository} from "./repositories/comments-db-repository";
import {DevicesRepository} from "./repositories/devices-db-repository";
import {PostsRepository} from "./repositories/posts-db-repository";
import {UsersRepository} from "./repositories/users-repository";
import {BlogsService} from "./domain/blogs-service";
import {PostsService} from "./domain/posts-service";
import {CommentsService} from "./domain/comments-service";
// import {CommentsController} from "./routers/comments-controller";
import {UsersService} from "./domain/users-service";
import {EmailAdapter} from "./adapters/email-adapter";
import {DevicesService} from "./domain/devices-service";
import {AuthController} from "./controllers/auth-controller";
import {PostsController} from "./controllers/posts-controller";
import {CommentsController} from "./controllers/comments-controller";
import {SecurityController} from "./controllers/security-controller";
import {UsersController} from "./controllers/users-controller";
import {BlogsController} from "./controllers/blogs-controller";

const attemptsRepository = new AttemptsRepository()
const authRepository = new AuthRepository()
const blogsRepository = new BlogsRepository()
const commentsRepository = new CommentsRepository()
const devicesRepository = new DevicesRepository()
const postsRepository = new PostsRepository()
const usersRepository = new UsersRepository()

const emailAdapter = new EmailAdapter(usersRepository)
const blogsService = new BlogsService(blogsRepository)
const postsService = new PostsService(blogsRepository, postsRepository)
const commentsService = new CommentsService(commentsRepository)
const usersService = new UsersService(usersRepository, emailAdapter)
const devicesService = new DevicesService(devicesRepository)

export const blogsControllerInstance = new BlogsController(blogsService, postsService)
export const postsControllerInstance = new PostsController(postsService)
export const commentsControllerInstance = new CommentsController(commentsService)
export const securityControllerInstance = new SecurityController(devicesRepository)
export const usersControllerInstance = new UsersController(usersService)
export const authControllerInstance = new AuthController(
    usersService, usersRepository, attemptsRepository,
    authRepository, devicesRepository, devicesService
)