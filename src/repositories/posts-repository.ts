import {errBlogId, errContent, errPostDesc, errTitle} from "../models/posts-errors-model";

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

    createPost(title: string, description: string, content: string, blogId: string) {
        let errors: any = {
            errorsMessages: []
        }

        if(!title || !title.trim() || title.length > 30) {
            errors.push(errTitle)
        }

        if(!description || !description.trim() || description.length > 100) {
            errors.push(errPostDesc)
        }

        if(!content || !content.trim() || content.length > 1000) {
            errors.push(errContent)
        }

        if(!blogId || !blogId.trim()) {
            errors.push(errBlogId)
        }

        if(errors.errorsMessages.length) {
            return errors
        }

        const newPost = {
            id: `${title}-${blogId}`,
            title: title,
            shortDescription: description,
            content: content,
            blogId: blogId,
            blogName: `blog.${title}`
        }

        posts.push(newPost)
        return newPost
    },

    getByid(id: string) {
        let foundPost = posts.find(p => p.id === id)
        return foundPost
    }

}