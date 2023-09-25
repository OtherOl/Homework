import {errBlogId, errContent, errPostDesc, errTitle} from "../models/posts-errors-model";
import {postModel} from "../models/post-model";
import {randomUUID} from "crypto";

let posts = [{
    id: "dasdsa",
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
        let errors: any = {
            errorsMessages: []
        }

        if (!inputData.title || !inputData.title.trim() || inputData.title.length > 30) {
            errors.push(errTitle)
        }

        if (!inputData.shortDescription || !inputData.shortDescription.trim() || inputData.shortDescription.length > 100) {
            errors.push(errPostDesc)
        }

        if (!inputData.content || !inputData.content.trim() || inputData.content.length > 1000) {
            errors.push(errContent)
        }

        if (!inputData.blogId || !inputData.blogId.trim()) {
            errors.push(errBlogId)
        }

        if (errors.errorsMessages.length) {
            return errors
        }

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

        let errors: any = {
            errorsMessages: []
        }

        if(!inputData.title || !inputData.title.trim() || inputData.title.length > 30) {
            errors.push(errTitle)
        }

        if(!inputData.shortDescription || !inputData.shortDescription.trim() || inputData.shortDescription.length > 100) {
            errors.push(errPostDesc)
        }

        if(!inputData.content || !inputData.content.trim() || inputData.content.length > 1000) {
            errors.push(errContent)
        }

        if(typeof inputData.blogId.trim()) {
            errors.push(errBlogId)
        }

        if(errors.errorsMessages.length) {
            return errors
        }

        if(!foundPost) {
            return null
        } else {
            foundPost.title = inputData.title
            foundPost.shortDescription = inputData.shortDescription
            foundPost.content = inputData.content
            foundPost.blogId = inputData.blogId
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