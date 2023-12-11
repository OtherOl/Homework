import "reflect-metadata"
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
import {Container} from "inversify";

export const container = new Container()

container.bind(BlogsController).to(BlogsController)
container.bind(PostsController).to(PostsController)
container.bind(CommentsController).to(CommentsController)
container.bind(SecurityController).to(SecurityController)
container.bind(UsersController).to(UsersController)
container.bind(AuthController).to(AuthController)

container.bind(EmailAdapter).to(EmailAdapter)
container.bind(BlogsService).to(BlogsService)
container.bind(PostsService).to(PostsService)
container.bind(UsersService).to(UsersService)
container.bind(DevicesService).to(DevicesService)
container.bind(LikesService).to(LikesService)
container.bind(CommentsService).to(CommentsService)

container.bind(AttemptsRepository).to(AttemptsRepository)
container.bind(AuthRepository).to(AuthRepository)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(CommentsRepository).to(CommentsRepository)
container.bind(DevicesRepository).to(DevicesRepository)
container.bind(PostsRepository).to(PostsRepository)
container.bind(UsersRepository).to(UsersRepository)
container.bind(LikesRepository).to(LikesRepository)

