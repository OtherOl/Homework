import {MongoClient} from "mongodb";
import {blogModel} from "../models/blog-model";

const mongoUri = process.env.mongoUri || 'mongodb://0.0.0.0:27017'

export const client = new MongoClient(mongoUri)

export async function runDb() {
    try {
        await client.connect();
        await client.db('blogs_posts').command({ping: 1});
        console.log('Connected successfully to mongo server');
    } catch {
        await client.close()
    }
}