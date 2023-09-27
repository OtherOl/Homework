// @ts-ignore
import request from "supertest"
import {app} from "../../src/settings";
import {errContent, errPostDesc, errBlogId} from "../../src/models/posts-errors-model";

describe("tests for Posts", () => {
    beforeAll(async () => {
        await request(app)
            .delete('/posts/testing/all-data')
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

    let createdPosts: any = null

    it('Post - success', async () => {
        const post = {
            title: "Hello world!",
            shortDescription: "coding prof",
            content: "trali bali shmali",
            blogId: "dsadsadlas",
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
            .send({title: 'valid title', shortDescription: 12340, content: 5678, blogId: 'NOOOOO'})
            .expect(400, {
                errorsMessages: [
                    errPostDesc,
                    errContent
                ]
            })

        await request(app)
            .put('/posts/99999999999999999')
            .send({title: 'Kok', shortDescription: 'Im well', content: 'https://dasdsa.com'})
            .expect(404)
    })

    it('Put - success', async () => {
        await request(app)
            .put(`/posts/${createdPosts.id}`)
            .send({title: 'Pilya', shortDescription: 'On the way to be the best developer!', content: 'Himalaya', blogId: 'YEEEES'})
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
