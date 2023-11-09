import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";

describe('Update Post (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to update a post', async()=>{
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

        const {id} = resposeCreatePost.body

        const resposeUpdatePost = await request(fastifyApp.server)
        .put(`/api/posts`)
        .send({
            id: {
                value: id
            },
            title: {
                value: "primeiro post atualizado"
            },
            active:{
              value: true  
            },
            body: {
                value: "descrição do post atualizado"
            },
            image: {
                filename: "nestjs.jpg",
                _buf: "arquivo1.buffer"
            }
        })
        .set('Authorization', `Bearer ${accessToken}`)

        expect(resposeUpdatePost.statusCode).toEqual(200)
    })

    test('should not be able to update a post with invalid user', async()=>{
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

        const {id} = resposeCreatePost.body

        const resposeUpdatePost = await request(fastifyApp.server)
        .put(`/api/posts`)
        .send({
            id: {
                value: id
            },
            title: {
                value: "primeiro post atualizado"
            },
            active:{
                value: true  
              },
            body: {
                value: "descrição do post atualizado"
            },
            image: {
                filename: "name1.jpg",
                _buf: "arquivo1.buffer"
            }
        })
        .set('Authorization', `Bearer ${accessToken}`)

        expect(resposeUpdatePost.statusCode).toEqual(404)
    })

    test('should not be able to update a post with invalid id post', async()=>{
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

        const {id} = resposeCreatePost.body

        const resposeUpdatePost = await request(fastifyApp.server)
        .put(`/api/posts`)
        .send({
            id: {
                value: randomUUID()
            },
            title: {
                value: "primeiro post atualizado"
            },
            active:{
                value: true  
            },
            body: {
                value: "descrição do post atualizado"
            },
            image: {
                filename: "name1.jpg",
                _buf: "arquivo1.buffer"
            }
        })
        .set('Authorization', `Bearer ${accessToken}`)

        expect(resposeUpdatePost.statusCode).toEqual(404)
    })
})