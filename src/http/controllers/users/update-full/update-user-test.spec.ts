import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";

describe('Update User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to update a user', async()=>{
        const responseRegisterUser = await request(fastifyApp.server).post('/api/users').send({
            cpf: "524.658.490-93",
            dateBirth: '2023-10-03',
            email: 'email1@test.com',
            gender: 'MASCULINO',
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
            email: 'email1@test.com',
            password: '123456',
        })

        const {accessToken, user} = responseLoginUser.body

        const response = await request(fastifyApp.server)
        .put('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id: user.id,
            name: 'Kaio Moreira',
            dateBirth: '1995-10-03',
            gender: 'MASCULINO',
            phone: '11999999999',
            rvLength: 10,
            rvPlate: 'ABC-789',
            touristType: 'CARAVANISTA',
            tugPlate: 'ABC-999',
            vehicleType: 'MOTORHOME',
        })
        expect(response.statusCode).toEqual(200)
    })

    test('should not be able to update a user with id user invalid', async()=>{
        const responseRegisterUser = await request(fastifyApp.server).post('/api/users').send({
            cpf: "524.658.490-11",
            dateBirth: '2023-10-03',
            email: 'email2@test.com',
            gender: 'MASCULINO',
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
            email: 'email2@test.com',
            password: '123456',
        })

        const {accessToken, user} = responseLoginUser.body

        const response = await request(fastifyApp.server)
        .put('/api/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            id: 'dee2a509-b42d-4c80-a733-d76bce3a2f10',
            name: 'Kaio Moreira',
            dateBirth: '1995-10-03',
            gender: 'MASCULINO',
            phone: '11999999999',
            rvLength: 10,
            rvPlate: 'ABC-789',
            touristType: 'CARAVANISTA',
            tugPlate: 'ABC-999',
            vehicleType: 'MOTORHOME',
        })
        expect(response.statusCode).toEqual(404)
    })
  
})