import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import "dotenv/config"
import { usersRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "./env";

export const fastifyApp = fastify()

fastifyApp.register(fastifyCors, {
    origin: true,
    credentials: true,
  })

fastifyApp.register(usersRoutes,{
    prefix: 'api/users'
})

  
fastifyApp.setErrorHandler((error:FastifyError, _request:FastifyRequest, reply: FastifyReply)=>{
  if(error instanceof ZodError){
      return reply.status(400).send({message: 'Validation error', issues: error.format()})
  }

  if(env.NODE_ENV !== 'production'){
      console.log(error)
  }else{
      // Aqui adicionar monitoramento de log em produção
      // como Sentry/NewRelic/DataDog
  }

  return reply.status(500).send({message: error.message})
})
