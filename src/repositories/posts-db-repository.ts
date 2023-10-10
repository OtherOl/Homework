import {PostDbModel, PostViewModel, UpdatePostModel} from "../models/post-model";
import {clientPostCollection} from "../data/DB-Mongo";
import {paginationModel} from "../models/pagination-model";

export const postsRepository = {
    async getAllPosts(sortBy: string = "createdAt", sortDirection: string = "desc",
                      pageNumber: number, pageSize: number): Promise< paginationModel<PostViewModel>> {
        let sortQuery: any = {};
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;

        const countPosts: number = await clientPostCollection.countDocuments()
        const foundPost: PostDbModel[] = await clientPostCollection
            .find({}, {projection: {_id: 0}})
            .sort(sortQuery)
            .skip((pageNumber - 1)*pageSize)
            .limit(pageSize)
            .toArray()

        const objects: paginationModel<PostViewModel> = {
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

    async createPost(inputData: PostDbModel) {
        return await clientPostCollection.insertOne({...inputData})
    },

    async updatePost(id: string, inputData: UpdatePostModel) {
        const isUpdated = await clientPostCollection.updateOne({id: id}, {
            $set: {...inputData}
        })

        return isUpdated.matchedCount === 1
    },

    async deletePost(id: string) {
        const deleteBlog = await clientPostCollection.deleteOne({id: id})

        return deleteBlog.deletedCount === 1
    }
}