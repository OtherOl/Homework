import {postModel} from "../models/post-model";
import {client} from "../data/DB-Mongo";

export const postsRepository = {
    async getAllPosts() {
        return client.db('blogs_posts').collection<postModel>('posts').find({}, {projection: {_id: 0}}).sort({createdAt: 1}).skip(1).limit(3).toArray()
    },

    async getPostById(id: string) {
        return client.db('blogs_posts').collection<postModel>('posts').findOne({id: id}, {projection: {_id: 0}})
    },

    async createPost(inputData: postModel) {
        const result = await client.db('blogs_posts').collection<postModel>('posts').insertOne({...inputData})
        return inputData
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
        const deleteBlog = await client.db('blogs_posts').collection<postModel>('posts').deleteOne({id: id})

        return deleteBlog.deletedCount === 1
    }
}