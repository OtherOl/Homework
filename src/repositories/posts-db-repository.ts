import {postModel} from "../models/post-model";
import {randomUUID} from "crypto";
import {DB} from "../data/DB";
import {client} from "../data/DB-Mongo";

export const postsRepository = {
    async getAllPosts() {
        return client.db('blogs_posts').collection<postModel>('posts').find({}).toArray()
    },

    async getPostById(id: string) {
        return client.db('blogs_posts').collection<postModel>('posts').findOne({id: id})
    },

    async createPost(inputData: postModel) {
        const newPost = {
            id: randomUUID(),
            title: inputData.title,
            shortDescription: inputData.shortDescription,
            content: inputData.content,
            blogId: DB.blogs[0].id,
            blogName: `blog.${inputData.title}`,
            createdAt: new Date().toISOString()
        }

        const result = await client.db('blogs_posts').collection<postModel>('posts').insertOne(newPost)
        return newPost
    },

    async updatePost(id: string, inputData: postModel) {
        const isUpdated = await client.db('blogs_posts').collection<postModel>('posts').updateOne({id: id}, {$set: {
                title: inputData.title,
                shortDescription: inputData.shortDescription,
                content: inputData.content,
                blogId: inputData.blogId
            }})

        return isUpdated.matchedCount === 1
    },

    async deletePost(id: string) {
        return client.db('blogs_posts').collection<postModel>('posts').deleteOne({id: id})
    }
}