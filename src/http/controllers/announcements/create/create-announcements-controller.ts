import { makeCreateAnnouncements } from '@/usecases/factories/announcements/make-create-announcements-usecase'
import { randomUUID } from 'crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import * as fs from 'fs'
import { Address, Prisma, Status } from '@prisma/client'
import { env } from '@/env'

export async function CreateAnnouncement (request: FastifyRequest, reply:FastifyReply){
        try {
            const multiparformSchema = z.object({
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
                street: z.object({
                    value: z.string()
                }).optional(),
                num: z.object({
                    value: z.coerce.number()
                }).optional(),
                city: z.object({
                    value: z.string()
                }).optional(),
                state: z.object({
                    value: z.string().nonempty()
                }),
                country: z.object({
                    value: z.string()
                }).optional(),
                district: z.object({
                    value: z.string()
                }).optional(),
                zipCode: z.object({
                    value: z.string()
                }).optional(),
                complement: z.object({
                    value: z.string()
                }).optional(),
                reference: z.object({
                    value: z.string()
                }).optional(),
            })

            const { 
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
                street,
                city,
                complement,
                country,
                district,
                zipCode,
                num,
                reference,
                state,
            } = multiparformSchema.parse(request.body)

            

            const referenceValue = reference ? reference.value : null 
            const complementValue = complement ? complement.value : null
            const linkDetailValue = linkDetail ? linkDetail.value : null
            const descriptionValue = description ? description.value : null
            const emphasisValue = emphasis ? emphasis.value : null
            const statusValue = status ? status.value : null
            const titleValue = title.value
            const categoryValue = category.value
            const contactInfoValue = contactInfo.value
            const expirationDateValue = expirationDate.value
            const priceValue = price.value
            const streetValue = street ? street.value : null
            const cityValue = city ? city.value : null
            const countryValue = country ? country.value : null
            const districtValue = district ? district.value : null
            const zipCodeValue = zipCode ? zipCode.value : null
            const numValue = num ? num.value : 0
            const stateValue = state.value
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

            const createAnnouncementUseCase = await makeCreateAnnouncements()
            const announcement = await createAnnouncementUseCase.execute({
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
               address:{
                city: cityValue ? cityValue : null,
                complement: complementValue as string,
                country: countryValue ? countryValue : null,
                district: districtValue ? districtValue : null,
                num: numValue ? new Prisma.Decimal(numValue as unknown as number) : null,
                reference: referenceValue as string,
                state: stateValue,
                street: streetValue ? streetValue : null,
                zipCode: zipCodeValue ? new Prisma.Decimal(zipCodeValue as unknown as number) : null,
               } as Address
            })

            return reply.status(201).send(announcement)
            
          } catch (error) {
            throw error
          }
}
    
