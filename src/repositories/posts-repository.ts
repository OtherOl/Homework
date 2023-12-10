import {PostDbModel, PostViewModel, UpdatePostModel} from "../models/post-model";
import {paginationModel} from "../models/pagination-model";
import {commentDbModel} from "../models/comments-model";
import {CommentModelClass, LikeModelClass, PostModelClass, UserModelClass} from "../data/DB-Mongo";
import {randomUUID} from "crypto";
import {likesPostModel} from "../models/likes-model";

export class PostsRepository {
    async getAllPosts(
        sortBy: string = "createdAt",
        sortDirection: string = "desc",
        pageNumber: number,
        pageSize: number,
        userId: string
    ): Promise<paginationModel<PostViewModel>> {
        let sortQuery: any = {};
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1;

        const like = await LikeModelClass.find({userId: userId}).lean()
        const countPosts: number = await PostModelClass.countDocuments()
        const foundPost: PostDbModel[] = await PostModelClass
            .find({}, {_id: 0})
            .sort(sortQuery)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        const likes: likesPostModel[] = await LikeModelClass.find({type: "Like"},
            {_id: 0, type: 0}).sort({addedAt: -1}).limit(3).lean()

        const postsQuery: any[] = foundPost.map(post => {
            let likeStatus = ""
            const status = like.find(a => a.postId === post.id)
            const newestLikes = likes.filter(a => a.postId === post.id)
            if (status) {
                likeStatus = status.type
            } else {
                likeStatus = 'None'
            }

            return {
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: post.extendedLikesInfo.likesCount,
                    dislikesCount: post.extendedLikesInfo.dislikesCount,
                    myStatus: likeStatus,
                    newestLikes: newestLikes.map(like => {
                        const {postId, ...rest} = like
                        return rest
                    })
                }
            }
        })

        const objects: paginationModel<PostViewModel> = {
            pagesCount: Math.ceil(countPosts / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countPosts,
            items: postsQuery,
        }

        return objects
    }

    async getPostById(
        id: string,
        type: string
    ) {
        const post = await PostModelClass.findOne({id: id}, {_id: 0}).lean()
        if(!post) return false
        const likes: likesPostModel[] = await LikeModelClass.find({postId: id, type: "Like"},
            {_id: 0, postId: 0, type: 0}).sort({addedAt: -1}).limit(3).lean()

        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount,
                myStatus: type,
                newestLikes: likes
            }
        }
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
                postId: foundPost.id,
                id: randomUUID(),
                content: content,
                commentatorInfo: {
                    userId: foundUser!.id,
                    userLogin: foundUser!.login
                },
                createdAt: new Date().toISOString(),
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None",
                    likesList: []
                }
            }
            await CommentModelClass.create({...comment})
            return {
                id: comment.id,
                content: comment.content,
                commentatorInfo: {
                    userId: comment.commentatorInfo.userId,
                    userLogin: comment.commentatorInfo.userLogin
                },
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount: comment.likesInfo.likesCount,
                    dislikesCount: comment.likesInfo.dislikesCount,
                    myStatus: comment.likesInfo.myStatus
                }
            };
        }
    }

    async getCommentById(
        postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string = "createdAt",
        sortDirection: string = "desc",
        userId: string
    ) {
        let sortQuery: any = {}
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1

        const filter = {postId: postId}
        const isExists = await CommentModelClass.findOne(filter)
        const count: number = await CommentModelClass.countDocuments(filter)
        const comment: commentDbModel[] = await CommentModelClass
            .find(filter, {_id: 0})
            .sort(sortQuery)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        const like = await LikeModelClass.find({userId: userId})
        const commentsQuery: any[] = comment.map(item => {
            let likeStatus = ""
            const status = like.find(a => a.commentId === item.id)
            if (status) {
                likeStatus = status.type
            } else {
                likeStatus = 'None'
            }

            return {
                id: item.id,
                content: item.content,
                commentatorInfo: item.commentatorInfo,
                createdAt: item.createdAt,
                likesInfo: {
                    likesCount: item.likesInfo.likesCount,
                    dislikesCount: item.likesInfo.dislikesCount,
                    myStatus: likeStatus
                }
            }
        })

        const objects: paginationModel<commentDbModel> = {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: count,
            items: commentsQuery
        }

        if (!isExists) {
            return false
        } else {
            return objects
        }
    }

    async updateLikesInfo(
        postId: string,
        type: string
    ) {
        if (type === "Like") {
            return PostModelClass.updateOne({id: postId}, {
                $inc: {"extendedLikesInfo.likesCount": +1}
            })
        }
        if (type === "Dislike") {
            return PostModelClass.updateOne({id: postId}, {
                $inc: {"extendedLikesInfo.dislikesCount": +1}
            })
        }
    }

    async decreaseLikes(
        postId: string,
        type: string
    ) {
        if (type === "Like") return PostModelClass.updateOne({id: postId}, {
            $inc: {"extendedLikesInfo.dislikesCount": -1, "extendedLikesInfo.likesCount": +1}
        })

        if (type === "Dislike") return PostModelClass.updateOne({id: postId}, {
            $inc: {"extendedLikesInfo.dislikesCount": +1, "extendedLikesInfo.likesCount": -1}
        })

        if(type === "Like to none") return PostModelClass.updateOne({id: postId}, {
            $inc: {"extendedLikesInfo.likesCount": -1}
        })

        if(type === "Dislike to none") return PostModelClass.updateOne({id: postId}, {
            $inc: {"extendedLikesInfo.dislikesCount": -1}
        })
    }
}
