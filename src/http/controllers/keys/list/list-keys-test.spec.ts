import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";

describe('List Key (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to list a key', async()=>{
        const responseRegisterUser = await request(fastifyApp.server).post('/api/users').send({
            dateBirth: '2023-10-03',
            email: 'email22@test.com',
            name: 'Kaio Moreira',
            phone: '77-77777-7777',
            password: '123456',
            rvLength: 10,
            rvPlate: 'ABC-1234',
            touristType: 'ADMIRADOR',
            tugPlate: 'ABC-1234',
            vehicleType: 'CAMPER',
        })
        const responseLoginUser = await request(fastifyApp.server)
        .post('/api/users/login')
        .send({
            email: 'email22@test.com',
            password: '123456',
        })

        const {accessToken, user} = responseLoginUser.body
        
        for(let i = 1; i < 6; i++){
            await request(fastifyApp.server)
            .post(`/api/keys`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send()
        }

        const responseListKeys = await request(fastifyApp.server)
        .get(`/api/keys`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
        expect(responseListKeys.statusCode).toEqual(200)
        expect(responseListKeys.body).toHaveLength(5)
    })
})