import {PostDbModel, PostViewModel, UpdatePostModel} from "../models/post-model";
import {clientPostCollection, clientUserCollection} from "../data/DB-Mongo";
import {paginationModel} from "../models/pagination-model";
import {userModel} from "../models/user-model";
import {ObjectId} from "mongodb";

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
    },

    async createComment(
        id: string,
        content: string,
        userId: string
    ) {
        const foundPost = await clientPostCollection.findOne({id: id})

        const foundUser = await clientUserCollection.findOne({id: userId})

        if(!foundPost) {
            return false
        } else {
            return {
                id: foundPost.id,
                content: content,
                commentatorInfo: {
                    userId: foundUser!.id,
                    userLogin: foundUser!.login
                },
                createdAt: new Date().toISOString()
            }
        }
    }
}