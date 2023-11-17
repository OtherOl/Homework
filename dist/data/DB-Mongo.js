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
exports.runDb = exports.AttemptModelClass = exports.DeviceModelClass = exports.AuthModelClass = exports.CommentModelClass = exports.UserModelClass = exports.BlogModelClass = exports.PostModelClass = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_scheme_1 = require("../mongoose-schemes/post-scheme");
const blog_scheme_1 = require("../mongoose-schemes/blog-scheme");
const user_scheme_1 = require("../mongoose-schemes/user-scheme");
const comment_scheme_1 = require("../mongoose-schemes/comment-scheme");
const auth_scheme_1 = require("../mongoose-schemes/auth-scheme");
const device_scheme_1 = require("../mongoose-schemes/device-scheme");
const attempt_scheme_1 = require("../mongoose-schemes/attempt-scheme");
dotenv_1.default.config();
const mongoUri = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/blogs_posts`;
console.log(process.env.MONGO_URL);
if (!mongoUri) {
    throw new Error('URL doesnt found');
}
exports.PostModelClass = mongoose_1.default.model('posts', post_scheme_1.postScheme);
exports.BlogModelClass = mongoose_1.default.model('blogs', blog_scheme_1.blogScheme);
exports.UserModelClass = mongoose_1.default.model('users', user_scheme_1.userScheme);
exports.CommentModelClass = mongoose_1.default.model('comments', comment_scheme_1.commentScheme);
exports.AuthModelClass = mongoose_1.default.model('auth', auth_scheme_1.authScheme);
exports.DeviceModelClass = mongoose_1.default.model('devices', device_scheme_1.deviceScheme);
exports.AttemptModelClass = mongoose_1.default.model('attempts', attempt_scheme_1.attemptScheme);
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // await client.db('blogs_posts').command({ping: 1});
            yield mongoose_1.default.connect(mongoUri);
            console.log('Connected successfully to mongo server');
        }
        catch (_a) {
            yield mongoose_1.default.disconnect();
        }
    });
}
exports.runDb = runDb;
