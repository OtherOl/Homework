import {postModel} from "../models/post-model";
import {randomUUID} from "crypto";
import {DB} from "../data/DB";

export const postsRepository = {
    getAllPosts() {
        return DB.posts
    },

    getPostById(id: string) {
        return DB.posts.find(p => p.id === id)
    },

    createPost(inputData: postModel) {
        const newPost = {
            id: randomUUID(),
            title: inputData.title,
            shortDescription: inputData.shortDescription,
            content: inputData.content,
            blogId: DB.blogs[0].id,
            blogName: `blog.${inputData.title}`
        }

        DB.posts.push(newPost)
        return newPost
    },

    updatePost(inputData: postModel) {
        const foundPost = this.getPostById(inputData.id)

        if(!foundPost) return false

        foundPost.title = inputData.title
        foundPost.shortDescription = inputData.shortDescription
        foundPost.content = inputData.content
        foundPost.blogId = inputData.blogId
    },

    deletePost(id: string) {
        const findPost = this.getPostById(id)
        if(!findPost) return false

        DB.posts = DB.posts.filter(p => p.id !== findPost.id)
        return true
    }
}