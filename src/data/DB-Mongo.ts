import dotenv from 'dotenv'
import mongoose from 'mongoose'
import {postScheme} from "../mongoose-schemes/post-scheme";
import {blogScheme} from "../mongoose-schemes/blog-scheme";
import {userScheme} from "../mongoose-schemes/user-scheme";
import {commentScheme} from "../mongoose-schemes/comment-scheme";
import {authScheme} from "../mongoose-schemes/auth-scheme";
import {deviceScheme} from "../mongoose-schemes/device-scheme";
import {attemptScheme} from "../mongoose-schemes/attempt-scheme";
import {likesScheme} from "../mongoose-schemes/likes-scheme";
dotenv.config()

const mongoUri = process.env.MONGO_URL || `mongodb://0.0.0.0:27017/blogs_posts`
console.log(process.env.MONGO_URL)

if (!mongoUri) {
    throw new Error('URL doesnt found')
}

export const PostModelClass = mongoose.model('posts', postScheme)
export const BlogModelClass = mongoose.model('blogs', blogScheme)
export const UserModelClass = mongoose.model('users', userScheme)
export const CommentModelClass = mongoose.model('comments', commentScheme)
export const AuthModelClass = mongoose.model('auth', authScheme)
export const DeviceModelClass = mongoose.model('devices', deviceScheme)
export const AttemptModelClass = mongoose.model('attempts', attemptScheme)
export const LikeModelClass = mongoose.model('likes', likesScheme)

export async function runDb() {
    try {
        await mongoose.connect(mongoUri)
        console.log('Connected successfully to mongo server');
    } catch {
        await mongoose.disconnect()
    }
}