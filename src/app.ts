import fastify from "fastify";
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import "dotenv/config"

export const fastifyApp = fastify()

fastifyApp.register(fastifyCors, {
    origin: true,
    credentials: true,
  })
  
fastifyApp.register(fastifyCookie)
