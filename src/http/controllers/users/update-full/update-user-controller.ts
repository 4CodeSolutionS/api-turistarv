import { CPFAlreadyExistsError } from '@/usecases/errors/cpf-already-exists-error'
import { EmailAlreadyExistsError } from '@/usecases/errors/email-already-exists-error'
import { ResourceNotFoundError } from '@/usecases/errors/resource-not-found-error'
import { makeUpdateUser } from '@/usecases/factories/users/make-update-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function UpdateUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchemaBody = z.object({
              id: z.string().uuid().nonempty(),
              name: z.string().min(4).nonempty(), 
              phone: z.string().nonempty(), 
              gender: z.enum(['MASCULINO', 'FEMININO']), 
              dateBirth: z.string().nonempty().refine((date) => {
                const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
                return dateRegex.test(date)
            }),
              rvLength: z.number().nonnegative(),
              rvPlate: z.string().nonempty(),
              touristType: z.enum(['CARAVANISTA', 'ADMIRADOR']),
              tugPlate: z.string().nonempty(),
              vehicleType: z.enum(['MOTORHOME', 'TRAILER', 'CAMPER', 'TENT']),
            })

            const { 
                id,
                gender,
                name,
                phone,
                dateBirth,
                rvLength,
                rvPlate,
                touristType,
                tugPlate,
                vehicleType

            } = userSchemaBody.parse(request.body)

            const updateUserUseCase = await makeUpdateUser()
            
            const {user} = await updateUserUseCase.execute({
                id,
                gender,
                name,
                phone,
                dateBirth: new Date(dateBirth),
                rvLength,
                rvPlate,
                touristType,
                tugPlate,
                vehicleType
            })
            
            
            return reply.status(200).send(user)
            
          } catch (error) {
            if(error instanceof  ResourceNotFoundError){
                return reply.status(404).send({ message: error.message})
              }
            if(error instanceof  EmailAlreadyExistsError){
              return reply.status(409).send({ message: error.message})
            }
            if(error instanceof  CPFAlreadyExistsError){
                return reply.status(401).send({ message: error.message})
            }
            throw error
          }
}
    
