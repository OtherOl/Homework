import request from 'supertest'
import {app} from "../../src/setting";
import {videos} from "../../src/routes/video-router";
import {erAuthor, erAvailableResolutions, erTitle} from "../../src/errors/errors-fields";


describe('/videos', () => {
    it('GET video - success - ]', async () => {
        await request(app)
            .get('/videos')
            .expect(videos)
    })

    it('POST video - fail - invalid', async () => {
        await request(app)
            .post('/videos')
            .send({title: "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd", author: '', availableResolutions: ''})
            .expect(400, {
                errorsMessages: [
                    erAuthor,
                    erTitle,
                    erAvailableResolutions
                ]
            })
    })

    it('POST video - success', async () => {
        await request(app)
            .post('/videos')
            .send({
                id: Number(new Date()),
                title: 'Pilya',
                author: 'Dima',
                canBeDownloaded: false,
                minAgeRestriction: 16,
                availableResolutions: ['P1080'],
            })
            .expect(201)
    })
})