const {describe, expect, afterEach, beforeAll, beforeEach, afterAll, test} = global
const app = require('./app/app')
const items = require('./data/items')
const request = require('supertest')

const MSG_404 = {msg: "name 'not-in-db' not found"}
describe('all tests', () => {
    beforeEach(() => {
        items.push({name: "popsicle", price: 1.45})
        items.push({name: 'cheerios', price: 3.40})
    })
    afterEach(() => {
        while (items.length > 0) {
            items.pop();
        }
    })
    describe('GET', () => {
        test('GET /items all items', async () => {

            const resp = await request(app).get('/items')
            expect(resp.status).toEqual(200)
            expect(resp.body).toEqual(items)
        })
        test('GET by name /items/:name', async () => {
            const resp = await request(app).get('/items/popsicle')
            expect(resp.status).toEqual(200)
            expect(resp.body).toEqual({name: "popsicle", price: 1.45})
        })
        test('GET by name /items/:name invalid', async () => {
            const resp = await request(app).get('/items/not-in-db')
            expect(resp.status).toEqual(404)
            expect(resp.body).toEqual(MSG_404)
        })
    })
    describe('POST /items', () => {
        test('POST Valid', async () => {

            const resp = await request(app)
                .post('/items')
                .send({name: "steak", price: 5.99})
            expect(resp.status).toEqual(201)
            expect(resp.body).toEqual({
                added: {name: "steak", price: 5.99}
            })
        })
        test('POST no name', async () => {

            const resp = await request(app)
                .post('/items')
                .send({price: 5.99})
            expect(resp.status).toEqual(400)

        })
    })

    describe('DELETE /items/:name', () => {
        test('/DELETE /items/:name', async () => {

            const resp = await request(app).delete('/items/popsicle')
            expect(resp.status).toEqual(200)
            expect(resp.body).toEqual({msg: "Deleted"})

        })
        test('/DELETE invalid name', async () => {

            const resp = await request(app).delete('/items/not-in-db')
            expect(resp.status).toEqual(404)
            expect(resp.body).toEqual(MSG_404)

        })
    })


    describe('PATCH /items/:name', () => {
        test('PATCH price', async () => {
            const resp = await request(app)
                .patch('/items/popsicle')
                .send({price:30})
            expect(resp.body).toEqual({updated:{'name':'popsicle', price:30}})
            expect(resp.status).toBe(200)
        })
        test('PATCH name', async () => {
            const resp = await request(app)
                .patch('/items/popsicle')
                .send({name:'steak'})
            expect(resp.body).toEqual({updated:{name:'steak', price:1.45}})
            expect(resp.status).toBe(200)
        })
        test('PATCH object', async () => {
            const resp = await request(app)
                .patch('/items/popsicle')
                .send({name:'steak',price:30})
            expect(resp.status).toBe(200)
            expect(resp.body).toEqual({updated:{name:'steak', price:30}})
        })
        test('PATCH fails due to 404', async () => {
            const resp = await request(app)
                .patch('/items/not-in-db')
                .send({name:'steak',price:30})
            expect(resp.status).toBe(404)
            expect(resp.body).toEqual(MSG_404)
        })
    })
})
