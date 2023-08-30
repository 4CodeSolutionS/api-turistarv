import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";

describe('Register User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to register a user with CPF', async()=>{
        const response = await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user1@turistarv.test',
            password: '123456',
            dateBirth: '1995-05-05',
            gender: 'MASCULINO',
            phone: '11999999999',
            cpf: '123.789.565-65',
            rvLength: 10,
            tugPlate: 'ABC1234',
            rvPlate: 'ABC1234',
            touristType: 'CARAVANISTA',
            vehicleType: 'MOTORHOME'
        })
            
        expect(response.statusCode).toEqual(201)
    })

    test('should be able to register a user with Passport', async()=>{
        const response = await request(fastifyApp.server).post('/api/users').send({
            name: 'Kaio Moreira',
            email: 'user2@turistarv.test',
            password: '123456',
            dateBirth: '1995-05-05',
            gender: 'MASCULINO',
            phone: '11999999999',
            passport: 'AB987654',
            rvLength: 10,
            tugPlate: 'ABC1234',
            rvPlate: 'ABC1234',
            touristType: 'CARAVANISTA',
            vehicleType: 'MOTORHOME'
        })
            
        expect(response.statusCode).toEqual(201)
    })
})