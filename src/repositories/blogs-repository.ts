import {randomUUID} from "crypto";
import {blogModel} from "../models/blog-model";

let blogs = [{
    id: randomUUID(),
    name: "a little bit",
    description: "shortcut",
    websiteUrl: "https://asda"
}]

export const blogsRepository = {
    getAllblogs() {
        return blogs
    },

    getBlogById(id: string) {
        return blogs.find(p => p.id === id)
    },

    createBlog(inputData: blogModel) {

        const newBlog = {
            id: randomUUID(),
            name: inputData.name,
            description: inputData.description,
            websiteUrl: inputData.websiteUrl
        }
        blogs.push(newBlog)
        return newBlog
    },

    updateBlog(inputData: blogModel) {
        let foundBlog = this.getBlogById(inputData.id)

        if(!foundBlog) {
            return false
        } else {
            foundBlog.name = inputData.name
            foundBlog.description = inputData.description
            foundBlog.websiteUrl = inputData.websiteUrl
        }
    },

    deleteBlog(id: string) {
        let foundBlog = blogs.find(p => p.id === id)

        if(!foundBlog) return false

        blogs = blogs.filter(p => p.id !== foundBlog?.id)
        return true
    },

    deleteAllBlogs() {
        blogs = []
        return true
    }
}