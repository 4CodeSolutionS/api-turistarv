import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

describe('List Lead (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()

    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to list a lead', async()=>{
        await prisma.user.create({
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


        for(let i = 0; i < 10; i++){
            await request(fastifyApp.server).post('/api/leads').send({
                email: `email${i}@test.com`,
                name: 'Kaio Moreira',
                phone: '77777777777',
            })
        }

        const responseListLeads = await request(fastifyApp.server)
        .get('/api/leads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

        expect(responseListLeads.statusCode).toEqual(200)
        expect(responseListLeads.body.length).toEqual(10)
    })
})