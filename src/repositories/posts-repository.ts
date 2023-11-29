import {PostDbModel, PostViewModel, UpdatePostModel} from "../models/post-model";
import {paginationModel} from "../models/pagination-model";
import {commentDbModel} from "../models/comments-model";
import {CommentModelClass, PostModelClass, UserModelClass} from "../data/DB-Mongo";

export class PostsRepository {
    async getAllPosts(
        sortBy: string = "createdAt",
        sortDirection: string = "desc",
        pageNumber: number,
        pageSize: number
    ): Promise<paginationModel<PostViewModel>> {
        let sortQuery: any = {};
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;

        const countPosts: number = await PostModelClass.countDocuments()
        const foundPost: PostDbModel[] = await PostModelClass
            .find({}, {_id: 0})
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
    }

    async getPostById(id: string) {
        return PostModelClass.findOne({id: id}, {_id: 0})
    }

    async createPost(inputData: PostDbModel) {
        return await PostModelClass.create({...inputData})
    }

    async updatePost(
        id: string,
        inputData: UpdatePostModel
    ) {
        const isUpdated = await PostModelClass.updateOne({id: id}, {
            $set: {...inputData}
        })

        return isUpdated.matchedCount === 1
    }

    async deletePost(id: string) {
        const deleteBlog = await PostModelClass.deleteOne({id: id})

        return deleteBlog.deletedCount === 1
    }

    async createComment(
        id: string,
        content: string,
        userId: string
    ) {
        const foundPost = await PostModelClass.findOne({id: id})

        const foundUser = await UserModelClass.findOne({id: userId})

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
                createdAt: new Date().toISOString(),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None"
                }
            }
            await CommentModelClass.create({...comment})

            return comment;
        }
    }

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
        const isExists = await CommentModelClass.findOne(filter)
        const count: number = await CommentModelClass.countDocuments(filter)
        const comment: commentDbModel[] = await CommentModelClass
            .find(filter, {_id: 0})
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
    }
}
