import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeCreateAddress } from '@/usecases/factories/address/make-create-address-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateAddress (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
                user: z.object({
                    id: z.string().uuid().optional(),
                }).optional(),
                announcement: z.object({
                    id: z.string().uuid().optional(),
                }).optional(),
                street: z.string().nonempty(),
                num: z.number().nonnegative(),
                district: z.string().nonempty(),
                country: z.string().nonempty(),
                city: z.string().nonempty(),
                state: z.string().nonempty(),
                zipCode: z.number().nonnegative(),
                complement: z.string().optional(),
                reference: z.string().optional(),
            })

            const { 
                announcement,
                user,
                street,
                num,
                district,
                country,
                city,
                state,
                zipCode,
                complement,
                reference,
            } = userSchema.parse(request.body)

            const createAddressUseCase = await makeCreateAddress()

            const address = await createAddressUseCase.execute({
                idUser: user?.id,
                idAnnouncement: announcement?.id,
                street,
                num,
                district,
                country,
                city,
                state,
                zipCode,
                complement,
                reference,
            })
            
           
            return reply.status(200).send(address)
            
          } catch (error) {
            if(error instanceof  ResourceNotFoundError){
              return reply.status(404).send({ message: error.message})
            }
            throw error
          }
}
    
