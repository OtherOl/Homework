import {MongoClient} from "mongodb";
import {blogModel} from "../models/blog-model";

const mongoUri = "mongodb+srv://OtherOl:24092003d@cluster0.c2fjrgk.mongodb.net/?retryWrites=true&w=majority"

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