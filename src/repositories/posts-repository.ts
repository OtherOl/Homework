import {postModel} from "../models/post-model";
import {randomUUID} from "crypto";

let posts = [{
    id: randomUUID(),
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "string",
    blogName: "string"
}]

export const postsRepository = {
    getAllPosts() {
        return posts
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

    getByid(id: string) {
        return posts.find(p => p.id === id)
    },

    updatePost(inputData: postModel) {
        let foundPost = posts.find(p => p.id === inputData.id)

        if(foundPost){
            foundPost.title = inputData.title
            foundPost.shortDescription = inputData.shortDescription
            foundPost.content = inputData.content
            foundPost.blogId = inputData.blogId
        } else {
            return false
        }
    },

    deletePost(inputData: postModel) {
        const findPost = posts.find(p => p.id === inputData.id)
        if(!findPost) {
            return false
        }

        posts = posts.filter(p => p.id !== findPost.id)
        return true
    },

    deleteAll() {
        posts = []
        return true
    }
}