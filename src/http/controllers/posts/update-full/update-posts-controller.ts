import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import * as fs from 'fs'
import { randomUUID } from 'crypto'
import { makeCreatePost } from '@/usecases/factories/posts/make-create-posts-usecase'
import { makeUpdatePost } from '@/usecases/factories/posts/make-update-posts-usecase'

export async function UpdatePost (request: FastifyRequest, reply:FastifyReply){
        try {
            const multiparformSchema = z.object({
                id: z.object({
                  value: z.string().uuid().nonempty()
                }),
                idUser: z.object({
                  value: z.string().uuid().nonempty()
                }),
                title: z.object({
                  value: z.string().nonempty(),
                }),
                body: z.object({
                  value: z.string().nonempty()
                }),
                image: z.object({
                  filename: z.string().nonempty(),
                  _buf: z.any()
                }).required(),
            })
           
              const {id, image, title, body, idUser} = multiparformSchema.parse(request.body)

              const { filename, _buf } = image
              const { value: titleValue } = title
              const { value: bodyValue } = body
              const { value: idUserValue } = idUser
              const { value: idValue } = id

            const fileNameFormated = `${randomUUID()} - ${filename}`;

            // subir arquivo na pasta local
            fs.writeFile(`./src/tmp/posts/${fileNameFormated}`, _buf, (err)=>{
              if (err) {
                console.error('Erro ao salvar o arquivo:', err);
                return reply.status(400).send({ message: 'Erro ao salvar o arquivo'})
              }
            })

            const createPostUseCase = await makeUpdatePost()
            
            const post = await createPostUseCase.execute({
                id:idValue,
                body: bodyValue,
                idUser: idUserValue,
                title: titleValue,
                image: fileNameFormated
            })

            return reply.status(200).send(post)
            
          } catch (error) {
            if(error instanceof  ResourceNotFoundError){
              return reply.status(404).send({ message: error.message})
            }
            throw error
          }
}
    
