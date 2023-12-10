import {blogModel, createBlogModel} from "../models/blog-model";
import {paginationModel} from "../models/pagination-model";
import {PostDbModel, PostViewModel} from "../models/post-model";
import {BlogModelClass, LikeModelClass, PostModelClass} from "../data/DB-Mongo";
import {likesPostModel} from "../models/likes-model";

export class BlogsRepository {
    async getAllBlogs(
        searchNameTerm: string,
        sortBy: string = "createdAt",
        sortDirection: string = "desc",
        pageNumber: number,
        pageSize: number
    ) {
        let sortQuery: any = {};
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1

        const filter = {name: RegExp(searchNameTerm, "i")}

        const countBlogs: number = await BlogModelClass.countDocuments(filter)
        const foundBlog: blogModel[] = await BlogModelClass
            .find(filter, {_id: 0})
            .sort(sortQuery)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        const objects: paginationModel<blogModel> = {
            pagesCount: Math.ceil(countBlogs / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: countBlogs,
            items: foundBlog,
        }

        return objects
    }

    async getPostByBlogId(
        blogId: string,
        sortBy: string = "createdAt",
        sortDirection: string = "desc",
        pageNumber: number,
        pageSize: number,
        userId: string
    ) {
        let sortQuery: any = {};
        sortQuery[sortBy] = sortDirection === "asc" ? 1 : -1

        const filter = {blogId: blogId}

        const like = await LikeModelClass.find({userId: userId}).lean()
        const isExists = await BlogModelClass.findOne({id: blogId})
        const countPosts: number = await PostModelClass.countDocuments(filter)
        const foundPosts: PostDbModel[] = await PostModelClass
            .find(filter, {_id: 0})
            .sort(sortQuery)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .lean()

        const likes: likesPostModel[] = await LikeModelClass.find({type: "Like"},
            {_id: 0, type: 0}).sort({addedAt: -1}).limit(3).lean()

        const postsQuery: any[] = foundPosts.map(post => {
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
            items: postsQuery
        }

        if (!isExists) {
            return false
        } else {
            return objects
        }
    }

    async getBlogById(id: string) {
        return BlogModelClass.findOne({id: id}, {projection: {_id: 0}})
    }

    async createBlog(inputData: blogModel) {
        await BlogModelClass.create({...inputData})
        return inputData
    }

    async updateBlog(id: string, inputData: createBlogModel) {
        const foundBlog = await BlogModelClass.updateOne({id: id}, {
            $set: {
                name: inputData.name,
                description: inputData.description,
                websiteUrl: inputData.websiteUrl
            }
        })

        return foundBlog.matchedCount === 1
    }

    async deleteBlog(id: string) {
        const deleteBlog = await BlogModelClass.deleteOne({id: id})

        return deleteBlog.deletedCount === 1
    }
}
