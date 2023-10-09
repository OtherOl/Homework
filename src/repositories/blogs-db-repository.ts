import {blogModel} from "../models/blog-model";
import {clientBlogCollection, clientPostCollection} from "../data/DB-Mongo";
import {paginationModel} from "../models/pagination-model";
import {postModel} from "../models/post-model";

export const blogsRepository = {
    async getAllBlogs(searchNameTerm: string, sortBy: string = "createdAt", sortDirection: string = "desc",
                      pageNumber: number, pageSize: number) {
        let sortQuery: any = {};
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1

        const filter = {name: RegExp(searchNameTerm, "i")}

        const countBlogs: number = await clientBlogCollection.countDocuments(filter)
        const foundBlog: blogModel[] = await clientBlogCollection
            .find(filter, {projection: {_id: 0}})
            .sort(sortQuery)
            .skip((pageNumber - 1)*pageSize)
            .limit(pageSize)
            .toArray()

        const objects: paginationModel<blogModel> = {
            pagesCount: Math.ceil(countBlogs / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countBlogs,
            items: foundBlog,
        }

        return objects
    },

    async getPostByBlogId(blogId: string, sortBy: string = "createdAt", sortDirection: string = "desc",
                          pageNumber: number, pageSize: number) {
        let sortQuery: any = {};
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1

        const filter = {blogId: blogId}

        const countPosts: number = await clientPostCollection.countDocuments(filter)
        const foundPosts: postModel[] = await clientPostCollection
            .find(filter, {projection: {_id: 0}})
            .sort(sortQuery)
            .skip((pageNumber - 1)*pageSize)
            .limit(pageSize)
            .toArray()

        const objects: paginationModel<postModel> = {
            pagesCount: Math.ceil(countPosts / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countPosts,
            items: foundPosts
        }

        return objects
    },

    async getBlogById(id: string) {
        return await clientBlogCollection.findOne({id: id}, {projection: {_id: 0}})
    },

    async createPostByBlogId(inputData: postModel) {
        const isExists = await clientBlogCollection.findOne({id: inputData.blogId})

        if(!isExists) {
            return false
        } else {
            const result = await clientPostCollection.insertOne({...inputData})
            return inputData
        }
    },

    async createBlog(inputData: blogModel) {
        const result = await clientBlogCollection.insertOne({...inputData})
        return inputData
    },

    async updateBlog(id: string, inputData: blogModel) {
        const foundBlog = await clientBlogCollection.updateOne({id: id}, {
            $set: {
                name: inputData.name,
                description: inputData.description,
                websiteUrl: inputData.websiteUrl
            }
        })

        return foundBlog.matchedCount === 1
    },

    async deleteBlog(id: string) {
        const deleteBlog = await clientBlogCollection.deleteOne({id: id})

        return deleteBlog.deletedCount === 1
    }
}