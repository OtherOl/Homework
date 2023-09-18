import request from 'supertest'
import {app} from "../../src/setting";
import {videos} from "../../src/routes/video-router";


describe('/videos', () => {
    it('Get video - success - ]', async () => {
        await request(app)
            .get('/videos')
            .expect(videos)
    })
})