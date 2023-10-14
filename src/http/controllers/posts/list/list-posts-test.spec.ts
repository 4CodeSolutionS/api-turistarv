import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

describe('List Post (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to list all post', async()=>{
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

        for(let i = 0; i < 2; i++){
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
        }

        const responseListPost = await request(fastifyApp.server)
        .get('/api/posts')
        .send()
        .set('Authorization', `Bearer ${accessToken}`)

        expect(responseListPost.statusCode).toEqual(200)
        expect(responseListPost.body).toHaveLength(2)
    }, 100000)
})