import { blogModel, createBlogModel } from "../models/blog-model";
export declare const blogsService: {
    getAllBlogs(searchNameTerm: string, sortBy: string, sortDirection: string, pageNumber: number, pageSize: number): Promise<import("../models/pagination-model").paginationModel<blogModel>>;
    getPostByBlogId(blogId: string, sortBy: string, sortDirection: string, pageNumber: number, pageSize: number): Promise<false | import("../models/pagination-model").paginationModel<import("../models/post-model").PostViewModel>>;
    getBlogById(id: string): Promise<import("mongodb").WithId<blogModel> | null>;
    createBlog(inputData: createBlogModel): Promise<blogModel>;
    updateBlog(id: string, inputData: blogModel): Promise<boolean>;
    deleteBlog(id: string): Promise<boolean>;
};
