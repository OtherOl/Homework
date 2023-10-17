import { CreatePostModel, PostDbModel, PostViewModel, UpdatePostModel } from "../models/post-model";
import { userModel } from "../models/user-model";
export declare const postsService: {
    getAllPosts(sortBy: string, sortDirection: string, pageNumber: number, pageSize: number): Promise<import("../models/pagination-model").paginationModel<PostViewModel>>;
    getPostById(id: string): Promise<import("mongodb").WithId<PostDbModel> | null>;
    createPost(inputData: CreatePostModel): Promise<PostViewModel | null>;
    updatePost(id: string, inputData: UpdatePostModel): Promise<boolean>;
    deletePost(id: string): Promise<boolean>;
    createComment(id: string, content: string, user: userModel): Promise<false | {
        id: string;
        content: string;
    }>;
};
