import request from 'supertest'
import {app} from "../src";

describe('/videos', () => {
    it('Get videos []', async => {
        request(app)
            .get('/videos/')
            .expect(201)

    })
})