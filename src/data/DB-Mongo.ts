import {MongoClient} from "mongodb";
import dotenv from 'dotenv'
import {PostDbModel,} from "../models/post-model";
import {blogModel} from "../models/blog-model";
import {createNewUserModel} from "../models/user-model";
import {commentDbModel} from "../models/comments-model";
import {tokensModel} from "../models/tokens-model";

dotenv.config()

const mongoUri = process.env.MONGO_URL
console.log(process.env.MONGO_URL)
if (!mongoUri) {
    throw new Error('URL doesnt found')
}

export const client = new MongoClient(mongoUri)

export const clientPostCollection = client.db('blogs_posts').collection<PostDbModel>('posts')
export const clientBlogCollection = client.db('blogs_posts').collection<blogModel>('blogs')
export const clientUserCollection = client.db('blogs_posts').collection<createNewUserModel>('users')
export const clientCommentCollection = client.db('blogs_posts').collection<commentDbModel>('comments')
export const clientAuthCollection = client.db('blogs_posts').collection<tokensModel>('auth')
export const clientSecurityCollection = client.db('blogs_posts').collection('devices')

export async function runDb() {
    try {
        await client.connect();
        await client.db('blogs_posts').command({ping: 1});
        console.log('Connected successfully to mongo server');
    } catch {
        await client.close()
    }
}