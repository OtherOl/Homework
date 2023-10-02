import {randomUUID} from "crypto";
import {blogModel} from "../models/blog-model";
import {client} from "../data/DB-Mongo";

export const blogsRepository = {
    async getAllBlogs() {
        return client.db('blogs_posts').collection<blogModel>('blogs').find({}).toArray()
    },

    async getBlogById(id: string) {
        return client.db('blogs_posts').collection<blogModel>('blogs').findOne({id: id})
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
        const result = await client.db('blogs_posts').collection<blogModel>('blogs').insertOne(newBlog)
        return newBlog
    },

    async updateBlog(id: string, inputData: blogModel) {
        const foundBlog = await client.db('blogs_posts').collection<blogModel>('blogs').updateOne({id: id}, {$set: {
            name: inputData.name,
            description: inputData.description,
            websiteUrl: inputData.websiteUrl
        }})

        return foundBlog.matchedCount === 1
    },

    async deleteBlog(id: string) {
        const deleteBlog = await client.db('blogs_posts').collection<blogModel>('blogs').deleteOne({id: id})

        return deleteBlog.deletedCount === 1
    }
}