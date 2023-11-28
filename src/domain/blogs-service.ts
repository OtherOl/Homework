import {randomUUID} from "crypto";
import {blogModel, createBlogModel} from "../models/blog-model";
import {BlogsRepository} from "../repositories/blogs-db-repository";

export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {}

    async getAllBlogs(
        searchNameTerm: string,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number
    ) {
        return await this.blogsRepository.getAllBlogs(
            searchNameTerm,
            sortBy,
            sortDirection,
            pageNumber,
            pageSize
        )
    }

    async getPostByBlogId(
        blogId: string,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number
    ) {
        return await this.blogsRepository.getPostByBlogId(
            blogId,
            sortBy,
            sortDirection,
            pageNumber,
            pageSize
        )
    }


    async getBlogById(id: string) {
        return await this.blogsRepository.getBlogById(id)
    }

    async createBlog(inputData: createBlogModel): Promise<blogModel> {
        const newBlog = {
            id: randomUUID(),
            name: inputData.name,
            description: inputData.description,
            websiteUrl: inputData.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        return await this.blogsRepository.createBlog(newBlog)
    }

    async updateBlog(id: string, inputData: blogModel) {
        return await this.blogsRepository.updateBlog(id, inputData)
    }

    async deleteBlog(id: string) {
        return await this.blogsRepository.deleteBlog(id)
    }
}

// export const blogsService = new BlogsService()