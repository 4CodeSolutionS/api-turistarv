import { afterAll, beforeAll, describe, expect, test } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";

describe('Create Lead (e2e)', ()=>{
    beforeAll(async()=>{
        await fastifyApp.ready()
    })

    afterAll(async()=>{
        await fastifyApp.close()
    })

    test('should be able to create a lead', async()=>{
        const responseCreateLead = await request(fastifyApp.server).post('/api/leads').send({
            email: 'email33@test.com',
            name: 'Kaio Moreira',
            phone: '77777777777',
        })

        expect(responseCreateLead.statusCode).toEqual(200)
    })

    test('should not be able to create a lead with email already exists', async()=>{
        const responseCreateLead = await request(fastifyApp.server).post('/api/leads').send({
            email: 'email33@test.com',
            name: 'Kaio Moreira',
            phone: '77777777777',
        })
        expect(responseCreateLead.statusCode).toEqual(409)
    })
  
})