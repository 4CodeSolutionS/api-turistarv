import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fastifyCors from '@fastify/cors'
import "dotenv/config"
import multer from "fastify-multer";
import { usersRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "./env";
import { InvalidAccessTokenError } from "./usecases/errors/invalid-access-token-error";
import { leadsRoutes } from "./http/controllers/leads/routes";
import { keysRoutes } from "./http/controllers/keys/route";
import { postsRoutes } from "./http/controllers/posts/router";
import urlEncodede from '@fastify/formbody'

export const fastifyApp = fastify()

fastifyApp.register(fastifyCors, {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
})


fastifyApp.register(urlEncodede)

fastifyApp.register(multer.contentParser)


fastifyApp.register(usersRoutes,{
    prefix: 'api/users'
})

fastifyApp.register(leadsRoutes,{
  prefix: 'api/leads'
})

fastifyApp.register(keysRoutes,{
  prefix: 'api/keys'
})

fastifyApp.register(postsRoutes,{
  prefix: 'api/posts'
})

  
fastifyApp.setErrorHandler((error:FastifyError, _request:FastifyRequest, reply: FastifyReply)=>{
  if(error instanceof ZodError){
      return reply.status(400).send({message: 'Campo inválido', issues: error.format()})
  }
  if(error instanceof InvalidAccessTokenError){
    return reply.status(401).send({ message: error.message})
  }

  if(env.NODE_ENV !== 'production'){
      console.log(error)
  }else{
      // Aqui adicionar monitoramento de log em produção
      // como Sentry/NewRelic/DataDog
  }

  return reply.status(500).send({message: error.message})
})
