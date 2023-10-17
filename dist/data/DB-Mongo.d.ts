import { MongoClient } from "mongodb";
import { PostDbModel } from "../models/post-model";
import { blogModel } from "../models/blog-model";
import { userModel } from "../models/user-model";
export declare const client: MongoClient;
export declare const clientPostCollection: import("mongodb").Collection<PostDbModel>;
export declare const clientBlogCollection: import("mongodb").Collection<blogModel>;
export declare const clientUserCollection: import("mongodb").Collection<userModel>;
export declare function runDb(): Promise<void>;
