"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const DB_1 = require("./data/DB");
const blogs_router_1 = require("./routers/blogs-router");
const posts_router_1 = require("./routers/posts-router");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
const port = 3000;
exports.app.get('/', (req, res) => {
    res.send('Hello, at this moment we will create our future!');
});
exports.app.delete('/testing/all-data', (req, res) => {
    DB_1.DB.posts = [];
    DB_1.DB.blogs = [];
    console.log('delete', DB_1.DB);
    res.sendStatus(204);
});
exports.app.use(express_1.default.json());
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
