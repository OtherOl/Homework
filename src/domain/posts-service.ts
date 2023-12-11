import {CreatePostModel, PostDbModel, PostViewModel, UpdatePostModel} from "../models/post-model";
import {randomUUID} from "crypto";
import {PostsRepository} from "../repositories/posts-repository";
import {BlogsRepository} from "../repositories/blogs-repository";
import {jwtService} from "../application/jwt-service";
import {LikesRepository} from "../repositories/likes-repository";
import {injectable} from "inversify";

@injectable()
export class PostsService {
    constructor(
        protected blogsRepository: BlogsRepository,
        protected postsRepository: PostsRepository,
        private likesRepository: LikesRepository
    ) {}

    async getAllPosts(
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number,
        userId: string
    ) {
        return await this.postsRepository.getAllPosts(
            sortBy,
            sortDirection,
            pageNumber,
            pageSize,
            userId
        )
    }

    async getPostById(
        id: string,
        accessToken: string | undefined
        ) {
        if(!accessToken) return await this.postsRepository.getPostById(id, "None")

        const userId = await jwtService.getUserIdByToken(accessToken.split(" ")[1])

        const like = await this.likesRepository.getLikeInfoPost(userId, id)
        if(!like) return await this.postsRepository.getPostById(id, "None")

        return await this.postsRepository.getPostById(id, like.type)
    }

    async createPost(inputData: CreatePostModel): Promise<PostViewModel | null> {
        const blog = await this.blogsRepository.getBlogById(inputData.blogId)
        if (!blog) return null

        const newPost: PostDbModel = {
            id: randomUUID(),
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
        }

        await this.postsRepository.createPost(newPost)
        return newPost
    }

    async updatePost(
        id: string,
        inputData: UpdatePostModel
    ) {
        return await this.postsRepository.updatePost(id, inputData)
    }

    async deletePost(
        id: string
    ) {
        return await this.postsRepository.deletePost(id)
    }

    async createComment(
        id: string,
        content: string,
        userId: string
    ) {
        return await this.postsRepository.createComment(id, content, userId)
    }

    async getCommentById(
        postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string,
        userId: string
    ) {
        return await this.postsRepository.getCommentById(
            postId,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            userId
        )
    }

    async updateLikesInfo(
        postId: string,
        type: string
    ) {
        return await this.postsRepository.updateLikesInfo(postId, type)
    }

    async decreaseLikes(
        postId: string,
        type: string
    ) {
        return await this.postsRepository.decreaseLikes(postId, type)
    }
}