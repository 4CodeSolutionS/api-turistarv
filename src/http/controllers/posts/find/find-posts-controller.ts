import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFindPost } from '@/usecases/factories/posts/make-find-posts-usecase'

export async function FindPost (request: FastifyRequest, reply:FastifyReply){
        try {
            const postSchemaParms = z.object({
                id: z.string().uuid(),
            })

            const { id } = postSchemaParms.parse(request.params)
           
            const findPostUseCase = await makeFindPost()
            
            const post = await findPostUseCase.execute({
               id
            })

            return reply.status(200).send(post)
            
          } catch (error) {
            if(error instanceof  ResourceNotFoundError){
              return reply.status(404).send({ message: error.message})
            }
            throw error
          }
}
    
