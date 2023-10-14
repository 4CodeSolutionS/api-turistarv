import { FastifyReply, FastifyRequest } from 'fastify'
import { makeListPost } from '@/usecases/factories/posts/make-list-posts-usecase'

export async function ListPost (request: FastifyRequest, reply:FastifyReply){
          try{
            const listPostsUseCase = await makeListPost()
            
            const posts = await listPostsUseCase.execute()

            return reply.status(200).send(posts)
            
          } catch (error) {
            throw error
          }
}
    
