import {blogModel} from "../models/blog-model";
import {clientBlogCollection, clientPostCollection} from "../data/DB-Mongo";
import {paginationModel} from "../models/pagination-model";

export const blogsRepository = {
    async getAllBlogs(searchNameTerm: string, sortBy: string = "createdAt", sortDirection: string = "desc",
                      pageNumber: number = 1, pageSize: number = 10) {
        let sortQuery: any = {};
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1

        const countBlogs: number = await clientBlogCollection.find({name: RegExp(searchNameTerm, "i")}, {projection: {_id: 0}}).count()
        const foundBlog: any = await clientBlogCollection.find({name: RegExp(searchNameTerm, "i")}, {projection: {_id: 0}})
            .sort(sortQuery).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()

        const objects: paginationModel[] = [{
            pagesCount: Math.ceil(countBlogs / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countBlogs,
            foundBlog: foundBlog,
        }]

        return objects.map(object => {

            return {
                pagesCount: object.pagesCount,
                page: object.page,
                pageSize: pageSize,
                totalCount: countBlogs,
                items: foundBlog
            }
        })
    },

    async getPostByBlogId(blogId: string, sortBy: string = "createdAt", sortDirection: string = "desc",
                          pageNumber: number = 1, pageSize: number = 10) {
        let sortQuery: any = {};
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1

        const countPosts: number = await clientPostCollection.find({blogId: blogId}, {projection: {_id: 0}}).count()
        const foundPosts: any =  await clientPostCollection.find({blogId: blogId}, {projection: {_id: 0}})
            .sort(sortQuery).skip(pageNumber - 1).limit(pageSize).toArray()

        const objects: paginationModel[] = [{
            pagesCount: Math.ceil(countPosts / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countPosts,
            foundBlog: foundPosts
        }]

        return objects.map(object => {
            return {
                pagesCount: object.pagesCount,
                page: object.page,
                pageSize: pageSize,
                totalCount: countPosts,
                items: foundPosts
            }
        })
    },

    async getBlogById(id: string) {
        return await clientBlogCollection.findOne({id: id}, {projection: {_id: 0}})
    },

    async createBlog(inputData: blogModel) {
        const result = await clientBlogCollection.insertOne({...inputData})
        return inputData
    },

    async updateBlog(id: string, inputData: blogModel) {
        const foundBlog = await clientBlogCollection.updateOne({id: id}, {$set: {
            name: inputData.name,
            description: inputData.description,
            websiteUrl: inputData.websiteUrl
        }})

        return foundBlog.matchedCount === 1
    },

    async deleteBlog(id: string) {
        const deleteBlog = await clientBlogCollection.deleteOne({id: id})

        return deleteBlog.deletedCount === 1
    }
}