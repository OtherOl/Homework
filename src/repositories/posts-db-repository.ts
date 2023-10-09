import {postModel} from "../models/post-model";
import {clientPostCollection} from "../data/DB-Mongo";
import {paginationModel} from "../models/pagination-model";

export const postsRepository = {
    async getAllPosts(pageNumber: number = 1, pageSize: number = 10, sortBy: string = "createdAT", sortDirection: string = "desc") {
        let sortQuery: any = {};
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;

        const countPosts: number = await clientPostCollection.find({}, {projection: {_id: 0}}).count()
        const foundPost: any[] = await clientPostCollection.find({}, {projection: {_id: 0}})
            .sort(sortQuery).skip(pageNumber - 1)
            .limit(pageSize).toArray()

        const objects: paginationModel<postModel> = {
            pagesCount: Math.ceil(countPosts / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countPosts,
            items: foundPost,
        }

        return objects
    },

    async getPostById(id: string) {
        return await clientPostCollection.findOne({id: id}, {projection: {_id: 0}})
    },

    async createPost(inputData: postModel) {
        const result = await clientPostCollection.insertOne({...inputData})
        return inputData
    },

    async updatePost(id: string, inputData: postModel) {
        const isUpdated = await clientPostCollection.updateOne({id: id}, {
            $set: {
                title: inputData.title,
                shortDescription: inputData.shortDescription,
                content: inputData.content,
                blogId: inputData.blogId
            }
        })

        return isUpdated.matchedCount === 1
    },

    async deletePost(id: string) {
        const deleteBlog = await clientPostCollection.deleteOne({id: id})

        return deleteBlog.deletedCount === 1
    }
}