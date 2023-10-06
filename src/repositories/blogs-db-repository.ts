import {blogModel} from "../models/blog-model";
import {clientBlogCollection} from "../data/DB-Mongo";

export const blogsRepository = {
    async getAllBlogs(searchNameTerm: string = "", sortBy: string = "createdAt", sortDirection: string = "desc",
                      pageNumber: number = 1, pageSize: number = 10) {
        let sortQuery: any = {};
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1

        return await clientBlogCollection.find({name: RegExp(searchNameTerm, "i")}, {projection: {_id: 0}}).sort(sortQuery).skip(pageNumber - 1)
            .limit(pageSize).toArray()
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