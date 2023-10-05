import {postModel} from "../models/post-model";
import {clientPostCollection} from "../data/DB-Mongo";

export const postsRepository = {
    async getAllPosts() {
        return clientPostCollection.find({}, {projection: {_id: 0}}).sort({createdAt: 1}).skip(1).limit(3).toArray()
    },

    async getPostById(id: string) {
        return clientPostCollection.findOne({id: id}, {projection: {_id: 0}})
    },

    async createPost(inputData: postModel) {
        const result = await clientPostCollection.insertOne({...inputData})
        return inputData
    },

    async updatePost(id: string, inputData: postModel) {
        const isUpdated = await clientPostCollection.updateOne({id: id}, {$set: {
                title: inputData.title,
                shortDescription: inputData.shortDescription,
                content: inputData.content,
                blogId: inputData.blogId
            }})

        return isUpdated.matchedCount === 1
    },

    async deletePost(id: string) {
        const deleteBlog = await clientPostCollection.deleteOne({id: id})

        return deleteBlog.deletedCount === 1
    }
}