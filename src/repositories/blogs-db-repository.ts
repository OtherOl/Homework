import {blogModel} from "../models/blog-model";
import {clientBlogCollection} from "../data/DB-Mongo";

export const blogsRepository = {
    async getAllBlogs() {
        return clientBlogCollection.find({}, {projection: {_id: 0}}).toArray()
    },

    async getBlogById(id: string) {
        return clientBlogCollection.findOne({id: id}, {projection: {_id: 0}})
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