import fastify from "fastify";
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import "dotenv/config"
import { env } from "./.env";

export const fastifyApp = fastify()

fastifyApp.register(fastifyCors, {
    origin: true,
    credentials: true,
  })
  
fastifyApp.register(fastifyJwt,
    {
        secret: env.JWT_SECRET,
    })


fastifyApp.register(fastifyCookie)
