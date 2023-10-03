import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { Token, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

describe('Verify e-mail User (e2e)', ()=>{
    beforeAll(async()=>{
        vi.useFakeTimers()
        await fastifyApp.ready()

    })

    afterAll(async()=>{
        vi.useRealTimers()
        await fastifyApp.close()
    })

    test('should be able to verify e-mail a user', async()=>{
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

        const {token} = await prisma.token.findFirstOrThrow({
            where:{
                idUser: user.id
            }
        }) as unknown as Token

        const response = await request(fastifyApp.server)
        .patch(`/api/users/verify-email?email=${user.email}&token=${token}`)
        .send()

        const findUser = await prisma.user.findUniqueOrThrow({
            where:{
                id: user.id
            }
        })
        expect(response.statusCode).toEqual(200)
        expect(findUser).toEqual(
            expect.objectContaining({
                emailActive: true
            })
        )
        
    })

    test('should not be able to verify e-mail user with wrong email', async()=>{
        const responseRegisterUser = await request(fastifyApp.server).post('/api/users').send({
            cpf: "524.658.490-45",
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

        const email = 'fake@email.com'
        const response = await request(fastifyApp.server)
        .post(`/api/users/verify-email?email=${email}&token=${accessToken}`)
        .send()
        expect(response.statusCode).toEqual(404)
    })

    test('should not be able to verify e-mail user with token expired', async()=>{
        vi.setSystemTime( new Date(2023, 10, 24, 7, 0, 0))
        const responseRegisterUser = await request(fastifyApp.server).post('/api/users').send({
            cpf: "524.658.478-93",
            dateBirth: '2023-10-03',
            email: 'email3@test.com',
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

        const {id, email} = responseRegisterUser.body

        const {token} = await prisma.token.findFirstOrThrow({
            where:{
                idUser: id
            }
        }) as unknown as Token

        vi.setSystemTime( new Date(2023, 10, 24, 10, 0, 1))
        const response = await request(fastifyApp.server)
        .patch(`/api/users/verify-email?email=${email}&token=${token}`)
        .send()

        const findUser = await prisma.user.findUniqueOrThrow({
            where:{
                id: id
            }
        })
        expect(response.statusCode).toEqual(401)
        expect(findUser).toEqual(
            expect.objectContaining({
                emailActive: false
            })
        )
    })

})