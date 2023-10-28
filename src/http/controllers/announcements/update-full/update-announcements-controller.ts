import { randomUUID } from 'crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import * as fs from 'fs'
import { Status } from '@prisma/client'
import { env } from '@/env'
import { makeUpdateAnnouncements } from '@/usecases/factories/announcements/make-update-announcements-usecase'

export async function UpdateAnnouncement (request: FastifyRequest, reply:FastifyReply){
        try {
            const multiparformSchema = z.object({
                id: z.object({
                    value: z.string().nonempty(),
                }),
                title: z.object({
                    value: z.string().nonempty(),
                }),
                description: z.object({
                    value: z.string()
                }).optional(),
                expirationDate: z.object({
                    value: z.string().nonempty(),
                }),
                category: z.object({
                    value: z.string().nonempty(),
                }),
                price: z.object({
                    value: z.coerce.number().positive(),
                }),
                contactInfo: z.object({
                    value: z.string().nonempty(),
                }),
                linkDetail: z.object({
                    value: z.string()
                }).optional(),
                emphasis: z.object({
                    value: z.coerce.boolean(),
                }).optional(),
                status: z.object({
                    value: z.enum(['ACTIVE', 'INACTIVE']),
                }).optional(),
                image: z.object({
                    filename: z.string().nonempty(),
                    _buf: z.any()
                  }).required(),
            })

            const { 
                id,
                title,
                category,
                contactInfo,
                description,
                emphasis,
                expirationDate,
                linkDetail,
                price,
                status,
                image,
            } = multiparformSchema.parse(request.body)

            

            const idValue = id.value
            const linkDetailValue = linkDetail ? linkDetail.value : null
            const descriptionValue = description ? description.value : null
            const emphasisValue = emphasis ? emphasis.value : null
            const statusValue = status ? status.value : null
            const titleValue = title.value
            const categoryValue = category.value
            const contactInfoValue = contactInfo.value
            const expirationDateValue = expirationDate.value
            const priceValue = price.value
            const { filename, _buf } = image
            const fileNameFormated = `${randomUUID()} - ${filename}`;

            const folderTmp = env.NODE_ENV === 'production' ? env.FOLDER_TMP_PRODUCTION : env.FOLDER_TMP_DEVELOPMENT

            // subir arquivo na pasta local
            fs.writeFile(`${folderTmp}/announcements/${fileNameFormated}`, _buf, (err)=>{
              if (err) {
                console.error('Erro ao salvar o arquivo:', err);
                return reply.status(400).send({ message: 'Erro ao salvar o arquivo'})
              }
            })

            const createAnnouncementUseCase = await makeUpdateAnnouncements()
            
            const announcement = await createAnnouncementUseCase.execute({
               id: idValue, 
               image: fileNameFormated,
               title: titleValue,
               category: categoryValue,
               contactInfo: contactInfoValue,
               description: descriptionValue as string,
               emphasis: emphasisValue ? emphasisValue as boolean : false,
               expirationDate: new Date(expirationDateValue),
               linkDetails: linkDetailValue as string,
               price: priceValue,
               status: statusValue as Status,
            })

            return reply.status(200).send(announcement)
            
          } catch (error) {
           
            throw error
          }
}
    
