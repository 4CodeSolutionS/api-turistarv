import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

describe('Delete Announcement (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to delete a announcement', async()=>{
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
        const { id } = resposeCreateAnnouncement.body

        const resposeDeleteAnnouncement = await request(fastifyApp.server)
        .delete(`/api/announcements/${id}`)
        .send()
        .set('Authorization', `Bearer ${accessToken}`)

        expect(resposeDeleteAnnouncement.statusCode).toEqual(200)
    })
})