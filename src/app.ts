import fastify, { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import fastifyCors from '@fastify/cors'
import "dotenv/config"
import fastifyMultipart from "@fastify/multipart";
import { usersRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "@/env";
import { leadsRoutes } from "./http/controllers/leads/routes";
import { keysRoutes } from "./http/controllers/keys/route";
import { postsRoutes } from "./http/controllers/posts/router";
import urlEncodede from '@fastify/formbody'
import { addressRoutes } from "./http/controllers/address/router";
import { announcementsRoutes } from "./http/controllers/announcements/routes";
import Sentry from '@immobiliarelabs/fastify-sentry'
import { AppError } from "./usecases/errors/app-error";
import rateLimiter from '@fastify/rate-limit'
import { campingRoutes } from "./http/controllers/campings/routes";
import { authRoutes } from "./http/controllers/auth/route";

export const fastifyApp = fastify()

fastifyApp.register(Sentry, {
  dsn: env.SENTRY_DSN,
  environment: 'production',
  setErrorHandler: false,
  enableTracing: env.NODE_ENV === 'production' ? true : false,
  release: '1.0.0',
});

fastifyApp.register(fastifyCors, {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
})

if(env.NODE_ENV === 'production'){
  fastifyApp.register(rateLimiter, {
    max: 10,
    timeWindow: '10 second'
  })
}

fastifyApp.register(fastifyMultipart, {attachFieldsToBody: true})

fastifyApp.register(urlEncodede)

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

fastifyApp.register(addressRoutes,{
  prefix: 'api/address'
})

fastifyApp.register(announcementsRoutes,{
  prefix: 'api/announcements'
})

fastifyApp.register(campingRoutes,{
  prefix: 'api/campings'
})

fastifyApp.register(authRoutes,{
  prefix: 'api/auth'
})

fastifyApp.setErrorHandler((error:FastifyError,request:FastifyRequest, reply: FastifyReply)=>{
  if(env.NODE_ENV !== 'production'){
  }else{
    if(error instanceof AppError){
      fastifyApp.Sentry.captureException(Error(error.message))
    }else{
      fastifyApp.Sentry.captureException(error)
    }
  }

  if(error instanceof ZodError){
    console.log(error)
    return reply.status(400).send({message: 'Campo inválido', issues: error.format()})
  }

  if(error instanceof AppError){
    return reply.status(error.statusCode).send({message: error.message})
  }

  if(error.statusCode === 429){
    return reply.status(429).send({message: 'Muitas requisições para o mesmo IP'})
  }

  return reply.status(500).send({message: error.message})
})
