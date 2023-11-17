import {blogModel, createBlogModel} from "../models/blog-model";
import {paginationModel} from "../models/pagination-model";
import {PostDbModel, PostViewModel} from "../models/post-model";
import {BlogModelClass, PostModelClass} from "../data/DB-Mongo";

export const blogsRepository = {
    async getAllBlogs(
        searchNameTerm: string,
        sortBy: string = "createdAt",
        sortDirection: string = "desc",
        pageNumber: number,
        pageSize: number
    ) {
        let sortQuery: any = {};
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1

        const filter = {name: RegExp(searchNameTerm, "i")}

        const countBlogs: number = await BlogModelClass.countDocuments(filter)
        const foundBlog: blogModel[] = await BlogModelClass
            .find(filter, {projection: {_id: 0}})
            .sort(sortQuery)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        const objects: paginationModel<blogModel> = {
            pagesCount: Math.ceil(countBlogs / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countBlogs,
            items: foundBlog,
        }

        return objects
    },

    async getPostByBlogId(
        blogId: string,
        sortBy: string = "createdAt",
        sortDirection: string = "desc",
        pageNumber: number,
        pageSize: number
    ) {
        let sortQuery: any = {};
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1

        const filter = {blogId: blogId}

        const isExists = await BlogModelClass.findOne({id: blogId})
        const countPosts: number = await PostModelClass.countDocuments(filter)
        const foundPosts: PostDbModel[] = await PostModelClass
            .find(filter, {projection: {_id: 0}})
            .sort(sortQuery)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        const objects: paginationModel<PostViewModel> = {
            pagesCount: Math.ceil(countPosts / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countPosts,
            items: foundPosts
        }

        if (!isExists) {
            return false
        } else {
            return objects
        }
    },

    async getBlogById(id: string) {
        return BlogModelClass.findOne({id: id}, {projection: {_id: 0}})
    },

    async createBlog(inputData: blogModel) {
        await BlogModelClass.create({...inputData})
        return inputData
    },

    async updateBlog(id: string, inputData: createBlogModel) {
        const foundBlog = await BlogModelClass.updateOne({id: id}, {
            $set: {
                name: inputData.name,
                description: inputData.description,
                websiteUrl: inputData.websiteUrl
            }
        })

        return foundBlog.matchedCount === 1
    },

    async deleteBlog(id: string) {
        const deleteBlog = await BlogModelClass.deleteOne({id: id})

        return deleteBlog.deletedCount === 1
    }
}