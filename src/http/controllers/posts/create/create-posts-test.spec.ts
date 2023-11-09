import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

describe('Create Post (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to create a post', async()=>{
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

        expect(resposeCreatePost.statusCode).toEqual(201)
    })
})