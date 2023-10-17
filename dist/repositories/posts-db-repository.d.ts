import { PostDbModel, PostViewModel, UpdatePostModel } from "../models/post-model";
import { paginationModel } from "../models/pagination-model";
import { userModel } from "../models/user-model";
export declare const postsRepository: {
    getAllPosts(sortBy: string | undefined, sortDirection: string | undefined, pageNumber: number, pageSize: number): Promise<paginationModel<PostViewModel>>;
    getPostById(id: string): Promise<import("mongodb").WithId<PostDbModel> | null>;
    createPost(inputData: PostDbModel): Promise<import("mongodb").InsertOneResult<PostDbModel>>;
    updatePost(id: string, inputData: UpdatePostModel): Promise<boolean>;
    deletePost(id: string): Promise<boolean>;
    createComment(id: string, content: string, user: userModel): Promise<false | {
        id: string;
        content: string;
    }>;
};
