import {PostDbModel, PostViewModel, UpdatePostModel} from "../models/post-model";
// import {clientCommentCollection, clientPostCollection, clientUserCollection} from "../data/DB-Mongo";
import {paginationModel} from "../models/pagination-model";
import {commentDbModel} from "../models/comments-model";
import {CommentModel, PostModel, UserModel} from "../data/DB-Mongo";

export const postsRepository = {
    async getAllPosts(
        sortBy: string = "createdAt",
        sortDirection: string = "desc",
        pageNumber: number,
        pageSize: number
    ): Promise<paginationModel<PostViewModel>> {
        let sortQuery: any = {};
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;

        const countPosts: number = await PostModel.countDocuments()
        const foundPost: PostDbModel[] = await PostModel
            .find({}, {projection: {_id: 0}})
            .sort(sortQuery)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

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
        return PostModel.findOne({id: id}, {projection: {_id: 0}})
    },

    async createPost(inputData: PostDbModel) {
        return await PostModel.create({...inputData})
    },

    async updatePost(
        id: string,
        inputData: UpdatePostModel
    ) {
        const isUpdated = await PostModel.updateOne({id: id}, {
            $set: {...inputData}
        })

        return isUpdated.matchedCount === 1
    },

    async deletePost(id: string) {
        const deleteBlog = await PostModel.deleteOne({id: id})

        return deleteBlog.deletedCount === 1
    },

    async createComment(
        id: string,
        content: string,
        userId: string
    ) {
        const foundPost = await PostModel.findOne({id: id})

        const foundUser = await UserModel.findOne({id: userId})

        if (!foundPost) {
            return false
        } else {
            const comment: commentDbModel = {
                id: foundPost.id,
                content: content,
                commentatorInfo: {
                    userId: foundUser!.id,
                    userLogin: foundUser!.login
                },
                createdAt: new Date().toISOString()
            }
            await CommentModel.create({...comment})

            return comment;
        }
    },

    async getCommentById(
        id: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string = "createdAt",
        sortDirection: string = "desc"
    ) {
        let sortQuery: any = {}
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1

        const filter = {id: id}
        const isExists = await CommentModel.findOne(filter)
        const count: number = await CommentModel.countDocuments(filter)
        const comment: commentDbModel[] = await CommentModel
            .find(filter, {projection: {_id: 0}})
            .sort(sortQuery)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        const objects: paginationModel<commentDbModel> = {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: count,
            items: comment
        }

        if (!isExists) {
            return false
        } else {
            return objects
        }
    },
}