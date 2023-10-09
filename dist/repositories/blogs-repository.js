"use strict";
// import {randomUUID} from "crypto";
// import {blogModel} from "../models/blog-model";
// import {DB} from "../data/DB";
//
// export const blogsRepository = {
//     getAllblogs() {
//         return DB.blogs
//     },
//
//     getBlogById(id: string) {
//         return DB.blogs.find(p => p.id === id)
//     },
//
//     createBlog(inputData: blogModel) {
//
//         const newBlog = {
//             id: randomUUID(),
//             name: inputData.name,
//             description: inputData.description,
//             websiteUrl: inputData.websiteUrl
//         }
//         DB.blogs.push(newBlog)
//         return newBlog
//     },
//
//     updateBlog(id: string, inputData: blogModel) {
//         let foundBlog = DB.blogs.find(p => p.id === id)
//
//         if(foundBlog) {
//             foundBlog.name = inputData.name
//             foundBlog.description = inputData.description
//             foundBlog.websiteUrl = inputData.websiteUrl
//             return true
//         } else {
//             return false
//         }
//     },
//
//     deleteBlog(id: string) {
//         let foundBlog = DB.blogs.find(p => p.id === id)
//
//         if(!foundBlog) return false
//
//         DB.blogs = DB.blogs.filter(p => p.id !== foundBlog?.id)
//         return true
//     }
// }
