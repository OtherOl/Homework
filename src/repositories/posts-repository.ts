import {postModel} from "../models/post-model";
import {randomUUID} from "crypto";

let posts = [{
    id: randomUUID(),
    title: "Little",
    shortDescription: "Nighmare in the city",
    content: "This video is about",
    blogId: "12345435",
    blogName: "string"
}]

export const postsRepository = {
    getAllPosts() {
        return posts
    },

    getPostById(id: string) {
        return posts.find(p => p.id === id)
    },

    createPost(inputData: postModel) {
        const newPost = {
            id: randomUUID(),
            title: inputData.title,
            shortDescription: inputData.shortDescription,
            content: inputData.content,
            blogId: inputData.blogId,
            blogName: `blog.${inputData.title}`
        }

        posts.push(newPost)
        return newPost
    },

    updatePost(inputData: postModel) {
        const foundPost = this.getPostById(inputData.id)

        if(!foundPost){
            return false
        } else {
            foundPost.title = inputData.title
            foundPost.shortDescription = inputData.shortDescription
            foundPost.content = inputData.content
            foundPost.blogId = inputData.blogId
        }
    },

    deletePost(id: string) {
        const findPost = posts.find(p => p.id === id)
        if(!findPost) return false

        posts = posts.filter(p => p.id !== findPost.id)
        return true
    },

    deleteAll() {
        posts = []
        return true
    }
}