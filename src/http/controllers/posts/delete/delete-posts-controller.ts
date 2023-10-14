import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeDeletePost } from '@/usecases/factories/posts/make-delete-posts-usecase'

export async function DeletePost (request: FastifyRequest, reply:FastifyReply){
        try {
            const postSchemaParms = z.object({
                id: z.string().uuid(),
            })

            const { id } = postSchemaParms.parse(request.params)
           
            const deletePostUseCase = await makeDeletePost()
            
            const post = await deletePostUseCase.execute({
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
    
