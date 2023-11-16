import dotenv from 'dotenv'
import mongoose from 'mongoose'
import {postScheme} from "../mongoose-schemes/post-scheme";
import {blogScheme} from "../mongoose-schemes/blog-scheme";
import {userScheme} from "../mongoose-schemes/user-scheme";
import {commentScheme} from "../mongoose-schemes/comment-scheme";
import {authScheme} from "../mongoose-schemes/auth-scheme";
import {deviceScheme} from "../mongoose-schemes/device-scheme";
import {attemptScheme} from "../mongoose-schemes/attempt-scheme";
dotenv.config()

let dbName = "blogs_posts"
const mongoUri = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/${dbName}`
console.log(process.env.MONGO_URL)

if (!mongoUri) {
    throw new Error('URL doesnt found')
}

export const PostModel = mongoose.model('posts', postScheme)
// export const clientPostCollection = client.db('blogs_posts').collection<PostDbModel>('posts')
export const BlogModel = mongoose.model('blogs', blogScheme)
// export const clientBlogCollection = client.db('blogs_posts').collection<blogModel>('blogs')
export const UserModel = mongoose.model('users', userScheme)
// export const clientUserCollection = client.db('blogs_posts').collection<createNewUserModel>('users')
export const CommentModel = mongoose.model('comments', commentScheme)
// export const clientCommentCollection = client.db('blogs_posts').collection<commentDbModel>('comments')
export const AuthModel = mongoose.model('auth', authScheme)
// export const clientAuthCollection = client.db('blogs_posts').collection<tokensModel>('auth')
export const DeviceModel = mongoose.model('devices', deviceScheme)
// export const clientSecurityCollection = client.db('blogs_posts').collection('devices')
export const AttemptModel = mongoose.model('attempts', attemptScheme)
// export const clientAttemptCollection = client.db('blogs_posts').collection('attempts')

export async function runDb() {
    try {
        // await client.db('blogs_posts').command({ping: 1});
        await mongoose.connect(mongoUri)
        console.log('Connected successfully to mongo server');
    } catch {
        await mongoose.disconnect()
    }
}