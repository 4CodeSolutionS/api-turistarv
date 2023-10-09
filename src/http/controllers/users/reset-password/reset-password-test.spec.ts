import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { Token } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

describe('Reset passowrd (e2e)', ()=>{
    beforeAll(async()=>{
        vi.useFakeTimers()
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        vi.useRealTimers()
        await fastifyApp.close()
    })

    test('should be able to reset password a user', async()=>{
        const responseRegisterUser = await request(fastifyApp.server).post('/api/users').send({
            cpf: "524.658.490-93",
            dateBirth: '2023-10-03',
            email: 'email1@test.com',
            name: 'Kaio Moreira',
            phone: '77-77777-7777',
            password: '123456',
            rvLength: 10,
            rvPlate: 'ABC-1234',
            touristType: 'ADMIRADOR',
            tugPlate: 'ABC-1234',
            vehicleType: 'CAMPER',
        })

        const user = responseRegisterUser.body

        const {token} = await prisma.token.findFirstOrThrow({
            where:{
                idUser: user.id
            }
        }) as unknown as Token

        const response = await request(fastifyApp.server)
        .patch(`/api/users/reset-password?token=${token}`)
        .send({
            password: '1234567'
        })

        expect(response.statusCode).toEqual(200)
    })

    test('should not be able to reset passowrd with token not valid', async()=>{
        const token = 'fake-token'
        const response = await request(fastifyApp.server)
        .patch(`/api/users/reset-password?token=${token}`)
        .send({
            password: '1234567798'
        })

        expect(response.statusCode).toEqual(404)
    })

    test('should not be able to reset passoword user with token expired', async()=>{
        await prisma.user.create({
            data:{
                id: '9ff0986d-fd7d-4bc4-ac68-9a3e3fc1451f',
                name:'user1',
                email: 'user3@test.com',
                cpf: "111.456.789-10",
                phone: '77-77777-7777',
                password: await hash('123456', 8),
                emailActive: false,
                dateBirth: new Date(2023, 10, 24),
            }
        })
        vi.setSystemTime( new Date(2023, 10, 24, 7, 0, 0))
        await request(fastifyApp.server)
        .post(`/api/users/forgot-password`)
        .send({
            email: 'user3@test.com'
        })

        const {token} = await prisma.token.findFirstOrThrow({
            where:{
                idUser: '9ff0986d-fd7d-4bc4-ac68-9a3e3fc1451f'
            }
        }) as unknown as Token

        vi.setSystemTime( new Date(2023, 10, 24, 10, 0, 1))
        
        const response = await request(fastifyApp.server)
        .patch(`/api/users/reset-password?token=${token}`)
        .send({
            password: '10101012'
        })

        const findUser = await prisma.user.findUniqueOrThrow({
            where:{
                id: '9ff0986d-fd7d-4bc4-ac68-9a3e3fc1451f'
            }
        })

        expect(response.statusCode).toEqual(401)
        
    })
})