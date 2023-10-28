import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

describe('Create Announcements (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to create a announcement', async()=>{
        const user = await prisma.user.create({
            data:{
             email: 'email12@test.com',
             name: 'Kaio Moreira',
             phone: '77-77777-7777',
             role: 'ADMIN',
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

        const resposeCreatePost = await request(fastifyApp.server)
        .post('/api/announcements')
        .send({
            title: {
                value: "primeiro post"
            },
            category: {
                value: "celular"
            },
            price: {
                value: 1000
            },
            contactInfo: {
                value: "77-77777-7777"
            },
            expirationDate: {
                value: "2024-09-09"
            },
            status: {
                value: "ACTIVE"
            },
            linkDetail: {
                value: "https://www.teste-info.com"
            },
            description:{
                value: "teste de anuncio"
            },
            state: {
                value: "BA"
            },
            image: {
                filename: "name.jpg",
                _buf: "arquivo.buffer"
            }
        })
        .set('Authorization', `Bearer ${accessToken}`)

        expect(resposeCreatePost.statusCode).toEqual(201)
    })

    test('should not be able to create a announcement with expirationDate invalid', async()=>{
        const user = await prisma.user.create({
            data:{
             email: 'email15@test.com',
             name: 'Kaio Moreira',
             phone: '77-77777-7777',
             role: 'ADMIN',
             password: await hash('123456', 8),
            }
         })
 
         const responseLoginUser = await request(fastifyApp.server)
         .post('/api/users/login')
         .send({
             email: 'email15@test.com',
             password: '123456'
         })
 
         const { accessToken } = responseLoginUser.body

        const resposeCreateAnnouncement = await request(fastifyApp.server)
        .post('/api/announcements')
        .send({
            title: {
                value: "primeiro post 1"
            },
            category: {
                value: "celular"
            },
            price: {
                value: 1000
            },
            contactInfo: {
                value: "77-77777-7777"
            },
            expirationDate: {
                value: "2021-09-09"
            },
            status: {
                value: "ACTIVE"
            },
            linkDetail: {
                value: "https://www.teste-info.com"
            },
            description:{
                value: "teste de anuncio"
            },
            state: {
                value: "BA"
            },
            image: {
                filename: "name.jpg",
                _buf: "arquivo.buffer"
            }
        })
        .set('Authorization', `Bearer ${accessToken}`)

        expect(resposeCreateAnnouncement.statusCode).toEqual(400)
    })

    test('should not be able to create a announcement with title already exists', async()=>{
        const user = await prisma.user.create({
            data:{
             email: 'email14@test.com',
             name: 'Kaio Moreira',
             phone: '77-77777-7777',
             role: 'ADMIN',
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

        await request(fastifyApp.server)
        .post('/api/announcements')
        .send({
            title: {
                value: "primeiro post"
            },
            category: {
                value: "celular"
            },
            price: {
                value: 1000
            },
            contactInfo: {
                value: "77-77777-7777"
            },
            expirationDate: {
                value: "2024-09-09"
            },
            status: {
                value: "ACTIVE"
            },
            linkDetail: {
                value: "https://www.teste-info.com"
            },
            description:{
                value: "teste de anuncio"
            },
            state: {
                value: "BA"
            },
            image: {
                filename: "name.jpg",
                _buf: "arquivo.buffer"
            }
        })
        .set('Authorization', `Bearer ${accessToken}`)

        const resposeCreatePost = await request(fastifyApp.server)
        .post('/api/announcements')
        .send({
            title: {
                value: "primeiro post"
            },
            category: {
                value: "celular"
            },
            price: {
                value: 1000
            },
            contactInfo: {
                value: "77-77777-7777"
            },
            expirationDate: {
                value: "2024-09-09"
            },
            status: {
                value: "ACTIVE"
            },
            linkDetail: {
                value: "https://www.teste-info.com"
            },
            description:{
                value: "teste de anuncio"
            },
            state: {
                value: "BA"
            },
            image: {
                filename: "name.jpg",
                _buf: "arquivo.buffer"
            }
        })
        .set('Authorization', `Bearer ${accessToken}`)

        expect(resposeCreatePost.statusCode).toEqual(409)
    })
})