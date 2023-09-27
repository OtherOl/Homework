import request from "supertest"
import {app} from "../../src/settings";
import {errDescription, errName, errWebsiteUrl} from "../../src/models/blogs-errors-model";

describe("tests for blogs", () => {
    beforeAll(async () => {
        await request(app)
            .delete('/blogs/testing/all-data')
    })

    it('Get - success', async () => {
        await request(app)
            .get('/blogs')
            .expect(200, [])
    })

    it('Get - fail', async () => {
        await request(app)
            .get('/blogs/1')
            .expect(404)
    })

    it('Post - fail - invalid fields', async () => {
        const fakeBlog = {
            name: 567890,
            description: 1123,
            websiteUrl: "https://create.ts"
        }

        await request(app)
            .post('/blogs')
            .send(fakeBlog)
            .expect(400, {
                errorsMessages: [
                    errName,
                    errDescription
                ]
            })
    })

    let createdBlog: any = null

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
        console.log(createdBlog)
    })

    it('Put - fail - invalid fields', async () => {
        console.log(createdBlog.id)
        await request(app)
            .put(`/blogs/${createdBlog.id}`)
            .send({name: 'valid name', description: 12345677, websiteUrl: 1234})
            .expect(400, {
                errorsMessages: [
                    errDescription,
                    errWebsiteUrl
                ]
            })

        await request(app)
            .put(`/blogs/dasdl;k12'3k32`)
            .send({name: 'Kok', description: 'Im well', websiteUrl: 'https://dasdsa.com'})
            .expect(404)
    })

    it('Put - success', async () => {
        await request(app)
            .put(`/blogs/${createdBlog.id}`)
            .send({name: 'Pilya', description: 'On the way to be the best developer!', websiteUrl: 'https://create.com'})
            .expect(204)
    })

    it('Delete - fail', async () => {
        await request(app)
            .delete('/blogs/12312312')
            .expect(404)
    })

    it('Delete - success', async () => {
        await request(app)
            .delete(`/blogs/${createdBlog.id}`)
            .expect(204)
    })
})
