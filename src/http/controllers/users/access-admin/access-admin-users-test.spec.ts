import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { Key } from "@prisma/client";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { IResponseRegisterAccount } from "@/usecases/users/register/register-usecase";

describe('Acess Admin User (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to access admin a user', async()=>{
        await prisma.user.create({
            data:{
             email: 'email12@test.com',
             name: 'Kaio Moreira',
             phone: '77-77777-7777',
             role: 'SUPER',
             password: await hash('123456', 8),
            }
         })

         const responseLoginUser = await request(fastifyApp.server)
         .post('/api/users/login')
         .send({
             email: 'email12@test.com',
             password: '123456'
         })
 
         const { accessToken } = responseLoginUser.body


         const responseRegisterUser = await request(fastifyApp.server).post('/api/users').send({
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

        const responseCreateKey = await request(fastifyApp.server)
        .post(`/api/keys`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        const {key} = responseCreateKey.body as Key

        const responseAccessAdmin = await request(fastifyApp.server)
        .patch(`/api/users/access-admin`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            idUser: user.id,
            key
        })

        expect(responseAccessAdmin.statusCode).toEqual(200)
        expect(responseAccessAdmin.body).toEqual(
            expect.objectContaining({
                role: 'ADMIN'
            })
        )
    })

    test('should not be able to access admin a user with invalid idUser', async()=>{
        await prisma.user.create({
            data:{
             email: 'email13@test.com',
             name: 'Kaio Moreira',
             phone: '77-77777-7777',
             role: 'SUPER',
             password: await hash('123456', 8),
            }
         })

         const responseLoginUser = await request(fastifyApp.server)
         .post('/api/users/login')
         .send({
             email: 'email13@test.com',
             password: '123456'
         })
 
         const { accessToken } = responseLoginUser.body

        const responseCreateKey = await request(fastifyApp.server)
        .post(`/api/keys`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        const {key} = responseCreateKey.body as Key

        const responseAccessAdmin = await request(fastifyApp.server)
        .patch(`/api/users/access-admin`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            idUser: randomUUID(),
            key
        })

        expect(responseAccessAdmin.statusCode).toEqual(404)
    })

    test('should not be able to access admin a user with key invalid', async()=>{
        await prisma.user.create({
            data:{
             email: 'email14@test.com',
             name: 'Kaio Moreira',
             phone: '77-77777-7777',
             role: 'SUPER',
             password: await hash('123456', 8),
            }
         })

         const responseLoginUser = await request(fastifyApp.server)
         .post('/api/users/login')
         .send({
             email: 'email14@test.com',
             password: '123456'
         })
 
         const { accessToken } = responseLoginUser.body

         const responseRegisterUser = await request(fastifyApp.server).post('/api/users').send({
            email: 'email4@test.com',
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

       const fakeKey = randomUUID()

        const responseAccessAdmin = await request(fastifyApp.server)
        .patch(`/api/users/access-admin`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            idUser: user.id,
            key: fakeKey
        })

        expect(responseAccessAdmin.statusCode).toEqual(404)
    })

    test('should not be able to access admin a user with key already active', async()=>{
        await prisma.user.create({
            data:{
             email: 'email15@test.com',
             name: 'Kaio Moreira',
             phone: '77-77777-7777',
             role: 'SUPER',
             password: await hash('123456', 8),
            }
         })

         const user = await prisma.user.create({
            data:{
                email: 'email57@test.com',
                name: 'Kaio Moreira',
                phone: '77-77777-7777',
                password: '123456',
            }
         })

         const responseLoginUser = await request(fastifyApp.server)
         .post('/api/users/login')
         .send({
             email: 'email15@test.com',
             password: '123456'
         })
 
         const { accessToken } = responseLoginUser.body
        
        const responseCreateKey = await request(fastifyApp.server)
        .post(`/api/keys`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        const {key} = responseCreateKey.body as Key

        await request(fastifyApp.server)
        .patch(`/api/users/access-admin`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            idUser: user.id,
            key
        })

        const responseAccessAdmin = await request(fastifyApp.server)
        .patch(`/api/users/access-admin`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
            idUser: user.id,
            key
        })

        expect(responseAccessAdmin.statusCode).toEqual(401)
    })
})