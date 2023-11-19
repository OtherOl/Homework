import {CreatePostModel, PostDbModel, PostViewModel, UpdatePostModel} from "../models/post-model";
import {randomUUID} from "crypto";
import {postsRepository} from "../repositories/posts-db-repository";
import {blogsRepository} from "../repositories/blogs-db-repository";

export const postsService = {
    async getAllPosts(
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number
    ) {
        return await postsRepository.getAllPosts(
            sortBy,
            sortDirection,
            pageNumber,
            pageSize
        )
    },

    async getPostById(id: string) {
        return await postsRepository.getPostById(id)
    },

    async createPost(inputData: CreatePostModel): Promise<PostViewModel | null> {
        const blog = await blogsRepository.getBlogById(inputData.blogId)
        if (!blog) return null

        const newPost: PostDbModel = {
            id: randomUUID(),
            title: inputData.title,
            shortDescription: inputData.shortDescription,
            content: inputData.content,
            blogId: blog.id,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }

        await postsRepository.createPost(newPost)
        return {
            id: newPost.id,
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt
        }
    },

    async updatePost(
        id: string,
        inputData: UpdatePostModel
    ) {
        return await postsRepository.updatePost(id, inputData)
    },

    async deletePost(
        id: string
    ) {
        return await postsRepository.deletePost(id)
    },

    async createComment(
        id: string,
        content: string,
        userId: string
    ) {
        return await postsRepository.createComment(id, content, userId)
    },

    async getCommentById(
        id: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string
    ) {
        return await postsRepository.getCommentById(
            id,
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        )
    },
}