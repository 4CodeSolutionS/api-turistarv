import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

describe('Update Announcements (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to update a announcement', async()=>{
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

        const resposeCreateAnnouncement = await request(fastifyApp.server)
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

        const {id} = resposeCreateAnnouncement.body

        const resposeUpdateAnnouncement = await request(fastifyApp.server)
        .put('/api/announcements')
        .send({
            id:{
                value: id
            },
            title: {
                value: "new announcement"
            },
            category: {
                value: "informatica"
            },
            price: {
                value: 2000
            },
            contactInfo: {
                value: "77-77777-8888"
            },
            expirationDate: {
                value: "2024-10-09"
            },
            status: {
                value: "INACTIVE"
            },
            linkDetail: {
                value: "https://www.teste-info.com"
            },
            description:{
                value: "new teste de anuncio"
            },
            state: {
                value: "SP"
            },
            image: {
                filename: "name1.jpg",
                _buf: "arquivo1.buffer"
            }
        })
        .set('Authorization', `Bearer ${accessToken}`)

        expect(resposeUpdateAnnouncement.statusCode).toEqual(200)
    })

    test('should not be able to update a announcement with expirationDate invalid', async()=>{
        const user = await prisma.user.create({
            data:{
             email: 'email13@test.com',
             name: 'Kaio Moreira',
             phone: '77-77777-7777',
             role: 'ADMIN',
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

        const resposeCreateAnnouncement = await request(fastifyApp.server)
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

        const {id} = resposeCreateAnnouncement.body

        const resposeUpdateAnnouncement = await request(fastifyApp.server)
        .put('/api/announcements')
        .send({
            id:{
                value: id
            },
            title: {
                value: "new announcement 12"
            },
            category: {
                value: "informatica"
            },
            price: {
                value: 2000
            },
            contactInfo: {
                value: "77-77777-8888"
            },
            expirationDate: {
                value: "2021-10-09"
            },
            status: {
                value: "INACTIVE"
            },
            linkDetail: {
                value: "https://www.teste-info.com"
            },
            description:{
                value: "new teste de anuncio"
            },
            state: {
                value: "SP"
            },
            image: {
                filename: "name1.jpg",
                _buf: "arquivo1.buffer"
            }
        })
        .set('Authorization', `Bearer ${accessToken}`)

        expect(resposeUpdateAnnouncement.statusCode).toEqual(401)
    })
    
    test('should not be able to update a announcement with title already exists', async()=>{
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

        const resposeCreateAnnouncement = await request(fastifyApp.server)
        .post('/api/announcements')
        .send({
            title: {
                value: "primeiro post 123"
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

        const {id} = resposeCreateAnnouncement.body

        const resposeUpdateAnnouncement = await request(fastifyApp.server)
        .put('/api/announcements')
        .send({
            id:{
                value: id
            },
            title: {
                value: "primeiro post 123"
            },
            category: {
                value: "informatica"
            },
            price: {
                value: 2000
            },
            contactInfo: {
                value: "77-77777-8888"
            },
            expirationDate: {
                value: "2024-10-09"
            },
            status: {
                value: "INACTIVE"
            },
            linkDetail: {
                value: "https://www.teste-info.com"
            },
            description:{
                value: "new teste de anuncio"
            },
            state: {
                value: "SP"
            },
            image: {
                filename: "name1.jpg",
                _buf: "arquivo1.buffer"
            }
        })
        .set('Authorization', `Bearer ${accessToken}`)

        expect(resposeUpdateAnnouncement.statusCode).toEqual(409)
    })
})