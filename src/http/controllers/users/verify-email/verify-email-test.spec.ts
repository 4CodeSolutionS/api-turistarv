import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import request from 'supertest'
import { fastifyApp } from "@/app";
import { Token, User } from "@prisma/client";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

describe('Verify e-mail User (e2e)', ()=>{
    beforeAll(async()=>{
        vi.useFakeTimers()
        await fastifyApp.ready()

    })

    afterAll(async()=>{
        vi.useRealTimers()
        await fastifyApp.close()
    })

    test('should be able to verify e-mail a user', async()=>{
        const {user} = await createAndAuthenticateUser(fastifyApp)

        const {token} = await prisma.token.findFirstOrThrow({
            where:{
                idUser: user.id
            }
        }) as unknown as Token

        const response = await request(fastifyApp.server)
        .patch(`/api/users/verify-email?email=${user.email}&token=${token}`)
        .send()

        const findUser = await prisma.user.findUniqueOrThrow({
            where:{
                id: user.id
            }
        })
        expect(response.statusCode).toEqual(200)
        expect(findUser).toEqual(
            expect.objectContaining({
                emailActive: true
            })
        )
        
    })

    test('should not be able to verify e-mail user with wrong email', async()=>{
        const {accessToken, user} = await createAndAuthenticateUser(
            fastifyApp,
            randomUUID(),
            "user2@test.com"
            
            )
        const response = await request(fastifyApp.server)
        .patch(`/api/users/verify-email?email=${user.email}&token=${accessToken}`)
        .send()

        expect(response.statusCode).toEqual(404)
    })

})