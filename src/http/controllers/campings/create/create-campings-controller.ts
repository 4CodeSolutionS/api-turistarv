import { env } from '@/env'
import { randomUUID } from 'crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import * as fs from 'fs'
import { makeCreateCamping } from '@/usecases/factories/campings/make-create-campings-usecase'

export async function CreateCamping(request: FastifyRequest, reply:FastifyReply){
        try {
            const ImageSchema = z.object({
              filename: z.string(),
              _buf: z.instanceof(Buffer),
            })

            const multiparformSchema = z.object({
                name: z.object({
                  value: z.string()
                }),
                propertyRules: z.object({
                  value: z.string(),
                }),
                description: z.object({
                  value: z.string()
                }),
                active: z.object({
                  value: z.coerce.boolean()
                }),
                // converte um objeto em array e retorna um array
                images: z.union([ImageSchema, ImageSchema.array()]).transform((value) => {
                  return Array.isArray(value) ? value : [value]
                }),
                areaImage: ImageSchema.optional()
            })
              const {
                name,
                propertyRules,
                active,
                description,
                images,
                areaImage,
              } = multiparformSchema.parse(request.body)
              const { value: nameValue } = name
              const { value: propertyRulesValue } = propertyRules
              const { value: activeValue } = active
              const { value: descriptionValue } = description

            // criar array de nomes de arquivos
            const fileNamesFormated = []
            let areaImageUpload = ''

            for(let image of images){
              
              const fileNameFormated = `${randomUUID()} - ${image.filename}`;

              const folderTmp = env.NODE_ENV === 'production' ? env.FOLDER_TMP_PRODUCTION : env.FOLDER_TMP_DEVELOPMENT

              // subir arquivo na pasta local
              fs.writeFile(`${folderTmp}/campings/${fileNameFormated}`, image._buf, (err)=>{
                if (err) {
                  console.error('Erro ao salvar o arquivo:', err);
                  return reply.status(400).send({ message: 'Erro ao salvar o arquivo'})
                }
              })

              fileNamesFormated.push(fileNameFormated)

              if(areaImage){
                areaImageUpload = `${randomUUID()} - ${areaImage.filename}`;

                fs.writeFile(`${folderTmp}/campings/${areaImageUpload}`, areaImage._buf, (err)=>{
                  if (err) {
                    console.error('Erro ao salvar o arquivo:', err);
                    return reply.status(400).send({ message: 'Erro ao salvar o arquivo'})
                  }
                })
              }
            }
            const createCampingUseCase = await makeCreateCamping()
            
            const camping = await createCampingUseCase.execute({
               name: nameValue,
               propertyRules: propertyRulesValue,
               active: activeValue,
               description: descriptionValue,
               areaImageName: areaImageUpload,
               fileNameImages: fileNamesFormated
            })
            return reply.status(200).send(camping)
            
          } catch (error) {
            
            throw error
          }
}
    
