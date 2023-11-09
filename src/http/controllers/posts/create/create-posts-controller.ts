import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import * as fs from 'fs'
import { randomUUID } from 'crypto'
import { makeCreatePost } from '@/usecases/factories/posts/make-create-posts-usecase'
import { env } from '@/env'

export async function CreatePost (request: FastifyRequest, reply:FastifyReply){
        try {
            const multiparformSchema = z.object({
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
           
              const {image, title, body} = multiparformSchema.parse(request.body)

              const { filename, _buf } = image
              const { value: titleValue } = title
              const { value: bodyValue } = body

            const fileNameFormated = `${randomUUID()} - ${filename}`;

            const folderTmp = env.NODE_ENV === 'production' ? env.FOLDER_TMP_PRODUCTION : env.FOLDER_TMP_DEVELOPMENT

            // subir arquivo na pasta local
            fs.writeFile(`${folderTmp}/posts/${fileNameFormated}`, _buf, (err)=>{
              if (err) {
                console.error('Erro ao salvar o arquivo:', err);
                return reply.status(400).send({ message: 'Erro ao salvar o arquivo'})
              }
            })

            const createPostUseCase = await makeCreatePost()
            
            const post = await createPostUseCase.execute({
                body: bodyValue,
                title: titleValue,
                image: fileNameFormated
            })

            return reply.status(201).send(post)
            
          } catch (error) {
            throw error
          }
}
    
