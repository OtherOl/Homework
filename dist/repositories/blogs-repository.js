"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const crypto_1 = require("crypto");
const DB_1 = require("../data/DB");
// let blogs = [{
//     id: randomUUID(),
//     name: "a little bit",
//     description: "shortcut",
//     websiteUrl: "https://asda"
// }]
exports.blogsRepository = {
    getAllblogs() {
        return DB_1.DB.blogs;
    },
    getBlogById(id) {
        return DB_1.DB.blogs.find(p => p.id === id);
    },
    createBlog(inputData) {
        const newBlog = {
            id: (0, crypto_1.randomUUID)(),
            name: inputData.name,
            description: inputData.description,
            websiteUrl: inputData.websiteUrl
        };
        DB_1.DB.blogs.push(newBlog);
        return newBlog;
    },
    updateBlog(inputData) {
        let foundBlog = this.getBlogById(inputData.id);
        if (!foundBlog) {
            return false;
        }
        else {
            foundBlog.name = inputData.name;
            foundBlog.description = inputData.description;
            foundBlog.websiteUrl = inputData.websiteUrl;
        }
    },
    deleteBlog(id) {
        let foundBlog = DB_1.DB.blogs.find(p => p.id === id);
        if (!foundBlog)
            return false;
        DB_1.DB.blogs = DB_1.DB.blogs.filter(p => p.id !== (foundBlog === null || foundBlog === void 0 ? void 0 : foundBlog.id));
        return true;
    }
};
