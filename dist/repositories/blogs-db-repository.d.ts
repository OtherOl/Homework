import { blogModel, createBlogModel } from "../models/blog-model";
import { paginationModel } from "../models/pagination-model";
import { PostViewModel } from "../models/post-model";
export declare const blogsRepository: {
    getAllBlogs(searchNameTerm: string, sortBy: string | undefined, sortDirection: string | undefined, pageNumber: number, pageSize: number): Promise<paginationModel<blogModel>>;
    getPostByBlogId(blogId: string, sortBy: string | undefined, sortDirection: string | undefined, pageNumber: number, pageSize: number): Promise<false | paginationModel<PostViewModel>>;
    getBlogById(id: string): Promise<import("mongodb").WithId<blogModel> | null>;
    createBlog(inputData: blogModel): Promise<blogModel>;
    updateBlog(id: string, inputData: createBlogModel): Promise<boolean>;
    deleteBlog(id: string): Promise<boolean>;
};
