import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

describe('Delete Post (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to delete a post', async()=>{
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
        .post('/api/posts')
        .send({
            idUser: {
                value: user.id
            },
            title: {
                value: "primeiro post"
            },
            body: {
                value: "descrição do post"
            },
            image: {
                filename: "name.jpg",
                _buf: "arquivo.buffer"
            }
        })
        .set('Authorization', `Bearer ${accessToken}`)

        const {id} = resposeCreatePost.body

        const resposeDeletePost = await request(fastifyApp.server)
        .get(`/api/posts/${id}`)
        .send()
        .set('Authorization', `Bearer ${accessToken}`)

        expect(resposeDeletePost.statusCode).toEqual(200)
    })

    test('should not be able to delete a post with invalid id', async()=>{
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

         const fakeId = 'bda625c4-9ac6-4de6-8f38-8a1d87854e6a'
        const resposeDeletePost = await request(fastifyApp.server)
        .delete(`/api/posts/${fakeId}`)
        .send()
        .set('Authorization', `Bearer ${accessToken}`)

        expect(resposeDeletePost.statusCode).toEqual(404)
    })
})