// @ts-ignore
import request from "supertest"
import {app} from "../../src";
import {errContent, errPostDesc, errBlogId} from "../../src/models/posts-errors-model";
import {blogModel} from "../../src/models/blog-model";
import {PostDbModel} from "../../src/models/post-model";

describe("tests for Posts", () => {
    beforeAll(async () => {
       const res =  await request(app)
            .delete('/testing/all-data')
        console.log(res)
    })

    it('Get - success', async () => {
        await request(app)
            .get('/posts')
            .expect(200, [])
    })

    it('Get - fail', async () => {
        await request(app)
            .get('/posts/1')
            .expect(404)
    })

    it('Post - fail - invalid fields', async () => {
        await request(app)
            .post('/posts')
            .send({title: "1234567890123456jjj", shortDescription: 12345, content: 9876, blogId: 12345})
            .expect(400, {
                errorsMessages: [
                    errPostDesc,
                    errContent,
                    errBlogId
                ]
            })
    })

    let createdPosts: PostDbModel
    let createdBlog: blogModel

    it('Post - success', async () => {
        const blog = {
            name: "Basic",
            description: "We will create our first program",
            websiteUrl: "https://create.ts"
        }
        const createdblog1 = await request(app)
            .post('/blogs')
            .send(blog)
            .expect(201)

        createdBlog = createdblog1.body

        await request(app)
            .get(`/blogs/` + createdblog1.body.id)
            .expect(200)

        const post = {
            title: "Hello world!",
            shortDescription: "coding prof",
            content: "trali bali shmali",
            blogId: createdblog1.body.id,
        }
        const created_post = await request(app)
            .post('/posts')
            .send(post)
            .expect(201)

        createdPosts = created_post.body

        await request(app)
            .get(`/posts/` + created_post.body.id)
            .expect(200)
    })

    it('Put - fail - invalid fields', async () => {
        await request(app)
            .put(`/posts/${createdPosts.id}`)
            .send({title: 'valid title', shortDescription: 12340, content: 5678, blogId: createdBlog.id})
            .expect(400)


    })

    it('Put - success', async () => {
        await request(app)
            .put('/posts/' + createdPosts.id)
            .send({title: 'VIDEONAME', shortDescription: 'THIS VIDEO IS ABOUT OUR LIFE', blogId: createdBlog.id})
            .expect(204)
    })

    it('Delete - fail', async () => {
        await request(app)
            .delete('/posts/12312312')
            .expect(404)
    })

    it('Delete - success', async () => {
        await request(app)
            .delete(`/posts/${createdPosts.id}`)
            .expect(204)
    })
})
