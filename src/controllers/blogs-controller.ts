import {BlogsService} from "../domain/blogs-service";
import {PostsService} from "../domain/posts-service";
import {Request, Response} from "express";
import {jwtService} from "../application/jwt-service";

export class BlogsController {
    constructor(
        protected blogsService: BlogsService,
        protected postsService: PostsService
    ) {
    }

    async getAllBlogs(req: Request<{}, {}, {}, blogGeneric>, res: Response) {
        const allBlogs = await this.blogsService.getAllBlogs(
            req.query.searchNameTerm, req.query.sortBy,
            req.query.sortDirection, req.query.pageNumber ? +req.query.pageNumber : 1,
            req.query.pageSize ? +req.query.pageSize : 10
        )
        res.status(200).send(allBlogs)
    }

    async createBlog(req: Request, res: Response) {
        const {name, description, websiteUrl} = req.body
        const newBlog = await this.blogsService.createBlog({name, description, websiteUrl})

        res.status(201).send(newBlog)
    }

    async getPostByBlogId(req: Request<{ blogId: string }, {}, {}, blogGeneric>, res: Response) {
        const accessToken = req.headers.authorization
        const userId = await jwtService.getUserIdByToken(accessToken?.split(" ")[1])
        const foundPost = await this.blogsService.getPostByBlogId(
            req.params.blogId, req.query.sortBy,
            req.query.sortDirection, req.query.pageNumber ? +req.query.pageNumber : 1,
            req.query.pageSize ? +req.query.pageSize : 10, userId
        )

        if (foundPost === false) {
            res.sendStatus(404)
        } else {
            res.status(200).send(foundPost)
        }
    }

    async createPostForBlog(req: Request, res: Response) {
        const blogId = req.params.blogId
        const {title, shortDescription, content} = req.body

        const newPost = await this.postsService.createPost({blogId, content, title, shortDescription})

        if (!newPost) {
            res.sendStatus(404)
        } else {
            res.status(201).send(newPost)
        }
    }

    async getBlogById(req: Request, res: Response) {
        let findBlog = await this.blogsService.getBlogById(req.params.id)

        if (!findBlog) {
            res.sendStatus(404)
        } else {
            res.status(200).send(findBlog)
        }
    }

    async updateBlog(req: Request, res: Response) {
        const {name, description, websiteUrl} = req.body

        const updatedBlog = await this.blogsService.updateBlog(req.params.id, {name, description, websiteUrl})

        if (updatedBlog) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async deleteBlogById(req: Request, res: Response) {
        const foundedBlog = await this.blogsService.deleteBlog(req.params.id)

        if (!foundedBlog) {
            res.sendStatus(404)
        } else {
            res.sendStatus(204)
        }
    }
}