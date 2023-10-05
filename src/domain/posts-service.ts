import {postModel} from "../models/post-model";
import {randomUUID} from "crypto";
import {postsRepository} from "../repositories/posts-db-repository";

export const postsService = {
    async getAllPosts(sortBy: string, sortDirection: string, pageNumber: number, pageSize: number) {
        return postsRepository.getAllPosts(sortBy, sortDirection, pageNumber, pageSize)
    },

    async getPostById(id: string) {
        return postsRepository.getPostById(id)
    },

    async createPost(inputData: postModel) {
        const newPost = {
            id: randomUUID(),
            title: inputData.title,
            shortDescription: inputData.shortDescription,
            content: inputData.content,
            blogId: inputData.blogId,
            blogName: `blog.${inputData.title}`,
            createdAt: new Date().toISOString()
        }

        return await postsRepository.createPost(newPost)
    },

    async updatePost(id: string, inputData: postModel) {
        return await postsRepository.updatePost(id, inputData)
    },

    async deletePost(id: string) {
        return await postsRepository.deletePost(id)
    }
}