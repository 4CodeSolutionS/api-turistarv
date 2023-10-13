import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeCreatePost } from '@/usecases/factories/posts/make-create-posts-usecases'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreatePost (request: FastifyRequest, reply:FastifyReply){
        try {
            console.log(request.files)
            console.log(request.body)
            const userSchemaBody = z.object({
                // idUser: z.string().uuid().nonempty(),
                title: z.string().nonempty().min(4),
                // body: z.string().nonempty(),
            })
            const uploadPostFile = z.array(
                z.object({
                    filename: z.string(),
                })
              )
              const safefileNames = uploadPostFile.safeParse(request.files)
  
              if(!safefileNames.success){
                return reply.status(404).send({error: 'File not found'})
              }
  
              const fileName = safefileNames.data[0].filename
              console.log(fileName)
            // const { 
            //     body,
            //     idUser,
            //     title
            // } = userSchemaBody.parse(request.body)

            const createPostUseCase = await makeCreatePost()
            
            // const post = await createPostUseCase.execute({
            //     body: 'body',
            //     idUser: '1f28ee52-2f3e-46f2-a95d-49c57da095cc',
            //     title: 'title',
            //     image: fileName
            // })
            // return reply.status(200).send(post)
            
          } catch (error) {
            if(error instanceof  ResourceNotFoundError){
              return reply.status(404).send({ message: error.message})
            }
            throw error
          }
}
    
