import {MongoClient} from "mongodb";
import dotenv from 'dotenv'
dotenv.config()

const mongoUri = process.env.MONGO_URL
console.log(process.env.MONGO_URL)
if(!mongoUri) {
    throw new Error('URL doesnt found')
}

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