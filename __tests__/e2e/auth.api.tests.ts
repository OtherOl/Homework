// import request from "supertest";
// import {app} from "../../src";
// import supertest from "supertest";
//
// const agent = supertest(app)
//
// describe("tests for auth & attempts", () => {
//     beforeAll(async () => {
//         await request(app)
//             .delete('testing/all-data')
//     })
//
//     it('Should return code 429 after if more than 5 requests were sent within 10 seconds', async () => {
//         const requests = []
//         for(let i = 0; i < 7; i++) {
//             requests.push(agent.post('/auth/registration'))
//         }
//         await Promise.all(requests);
//         expect(429);
//     })
// })