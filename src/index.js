"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blogs_router_1 = require("./routers/blogs-router");
const posts_router_1 = require("./routers/posts-router");
const DB_Mongo_1 = require("./data/DB-Mongo");
const users_router_1 = require("./routers/users-router");
const auth_router_1 = require("./routers/auth-router");
exports.app = (0, express_1.default)();
const port = process.env.PORT || 3000;
exports.app.use(express_1.default.json());
exports.app.get('/', (req, res) => {
    res.send('Hello, at this moment we will create our future!');
});
exports.app.delete('/testing/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resultBlog = yield DB_Mongo_1.clientBlogCollection.deleteMany({});
    const resultPost = yield DB_Mongo_1.clientPostCollection.deleteMany({});
    const resultUser = yield DB_Mongo_1.clientUserCollection.deleteMany({});
    res.sendStatus(204);
}));
exports.app.use(express_1.default.json());
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.use('/users', users_router_1.usersRouter);
exports.app.use('/auth', auth_router_1.authRouter);
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, DB_Mongo_1.runDb)();
    exports.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
startApp();