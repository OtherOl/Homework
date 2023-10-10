import {randomUUID} from "crypto";
import {blogModel} from "../models/blog-model";
import {blogsRepository} from "../repositories/blogs-db-repository";

export const blogsService = {
    async getAllBlogs(
        searchNameTerm: string,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number
    ) {
        return await blogsRepository.getAllBlogs(searchNameTerm,
            sortBy,
            sortDirection,
            pageNumber,
            pageSize
        )
    },

    async getPostByBlogId(
        blogId: string,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number
    ) {
        return await blogsRepository.getPostByBlogId(
            blogId,
            sortBy,
            sortDirection,
            pageNumber,
            pageSize
        )
    },


    async getBlogById(id: string) {
        return await blogsRepository.getBlogById(id)
    },

    async createBlog(inputData: blogModel) {
        const newBlog = {
            id: randomUUID(),
            name: inputData.name,
            description: inputData.description,
            websiteUrl: inputData.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return await blogsRepository.createBlog(newBlog)
    },

    async updateBlog(id: string, inputData: blogModel) {
        return await blogsRepository.updateBlog(id, inputData)
    },

    async deleteBlog(id: string) {
        return await blogsRepository.deleteBlog(id)
    }
}