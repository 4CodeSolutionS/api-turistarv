import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import * as fs from 'fs'
import { randomUUID } from 'crypto'
import { makeUpdatePost } from '@/usecases/factories/posts/make-update-posts-usecase'
import { env } from '@/env'

export async function UpdatePost (request: FastifyRequest, reply:FastifyReply){
        try {
            const multiparformSchema = z.object({
                id: z.object({
                  value: z.string().uuid().nonempty()
                }),
                title: z.object({
                  value: z.string().nonempty(),
                }),
                body: z.object({
                  value: z.string().nonempty()
                }),
                active: z.object({
                  value: z.coerce.boolean()
                }),
                image: z.object({
                  filename: z.string().nonempty(),
                  _buf: z.any()
                }).required(),
            })
           
              const {id, image, title, body, active} = multiparformSchema.parse(request.body)

              const { filename, _buf } = image
              const { value: titleValue } = title
              const { value: bodyValue } = body
              const { value: idValue } = id
              const { value: activeValue } = active

            const fileNameFormated = `${randomUUID()} - ${filename}`;

            const folderTmp = env.NODE_ENV === 'production' ? env.FOLDER_TMP_PRODUCTION : env.FOLDER_TMP_DEVELOPMENT

            // subir arquivo na pasta local
            fs.writeFile(`${folderTmp}/posts/${fileNameFormated}`, _buf, (err)=>{
              if (err) {
                console.error('Erro ao salvar o arquivo:', err);
                return reply.status(400).send({ message: 'Erro ao salvar o arquivo'})
              }
            })

            const createPostUseCase = await makeUpdatePost()
            
            const post = await createPostUseCase.execute({
                id:idValue,
                body: bodyValue,
                title: titleValue,
                image: fileNameFormated,
                active: activeValue
            })

            return reply.status(200).send(post)
            
          } catch (error) {
            throw error
          }
}
    
