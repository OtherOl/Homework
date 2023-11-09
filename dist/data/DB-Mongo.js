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
exports.runDb = exports.clientAttemptCollection = exports.clientSecurityCollection = exports.clientAuthCollection = exports.clientCommentCollection = exports.clientUserCollection = exports.clientBlogCollection = exports.clientPostCollection = exports.client = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoUri = process.env.MONGO_URL;
console.log(process.env.MONGO_URL);
if (!mongoUri) {
    throw new Error('URL doesnt found');
}
exports.client = new mongodb_1.MongoClient(mongoUri);
exports.clientPostCollection = exports.client.db('blogs_posts').collection('posts');
exports.clientBlogCollection = exports.client.db('blogs_posts').collection('blogs');
exports.clientUserCollection = exports.client.db('blogs_posts').collection('users');
exports.clientCommentCollection = exports.client.db('blogs_posts').collection('comments');
exports.clientAuthCollection = exports.client.db('blogs_posts').collection('auth');
exports.clientSecurityCollection = exports.client.db('blogs_posts').collection('devices');
exports.clientAttemptCollection = exports.client.db('blogs_posts').collection('attempts');
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.client.connect();
            yield exports.client.db('blogs_posts').command({ ping: 1 });
            console.log('Connected successfully to mongo server');
        }
        catch (_a) {
            yield exports.client.close();
        }
    });
}
exports.runDb = runDb;
