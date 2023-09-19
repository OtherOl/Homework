import request from 'supertest'
import {app} from "../../src/setting";
import {videos} from "../../src/routes/video-router";
import {erAuthor, erAvailableResolutions, erTitle} from "../../src/errors/errors-fields";


describe('tests for videos', () => {
    beforeAll(async () => {
        await request(app)
            .delete('/videos/testing/all-data')
    })

    it('GET - success ]', async () => {
        await request(app)
            .get('/videos')
            .expect([])
    })

    it('GET - fail - 404 not found ', async () => {
        await request(app)
            .get('/videos/1')
            .expect(404)
    })

    it('POST - fail - invalid fields', async () => {
        await request(app)
            .post('/videos')
            .send({title: "ddddddddddddddddddddddddddddddd_length_41", author: '', availableResolutions: ''})
            .expect(400, {
                errorsMessages: [
                    erAuthor,
                    erTitle,
                    erAvailableResolutions
                ]
            })
    })

    let createdVideo: any = null;
    it('POST - success', async () => {

        const postVideo = {
            id: Number(new Date()),
            title: 'Pilya',
            author: 'Dima',
            canBeDownloaded: false,
            minAgeRestriction: null,
            availableResolutions: ['P1080'],
        }

        const createResponse = await request(app)
            .post('/videos')
            .send(postVideo)
            .expect(201)

        createdVideo = createResponse.body

        await request(app)
            .get(`/videos/`)
            .expect(200, [createdVideo])

        await request(app)
            .get('/videos/' + createdVideo.id)
            .expect(200)

        await request(app)
            .get(`/videos/99999999999999`)
            .expect(404)
    })

    it('PUT - success - valid fields', async () => {

        await request(app)
            .put('/videos/' + createdVideo.id)
            .send({
                title: 'Author',
                author: 'Middle',
                minAgeRestriction: 16,
                availableResolutions: ['P720', 'P1440']
            })
            .expect(204)

        await request(app)
            .get(`/videos/${createdVideo.id}`)
            .expect(200, {
                ...createdVideo,
                title: 'Author',
                author: 'JUNIOR +',
                minAgeRestriction: 16,
                availableResolutions: ['P720', 'P1080', 'P1440']
            })
    })
})
