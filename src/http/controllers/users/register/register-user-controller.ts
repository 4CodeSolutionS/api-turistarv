import { CPFAlreadyExistsError } from '@/usecases/errors/cpf-already-exists-error'
import { EmailAlreadyExistsError } from '@/usecases/errors/email-already-exists-error'
import { makeRegisterUser } from '@/usecases/factories/users/make-register-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function RegisterUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
              cpf:z.string().refine((cpf) =>{
                  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/
                  return cpfRegex.test(cpf)
                }).optional(),
              name: z.string().min(4).nonempty(), 
              email: z.string().email().nonempty(), 
              password: z.string().min(6).nonempty(),
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
              passport: z.string().optional()
            })

            const { 
                email, 
                password,
                gender,
                name,
                phone,
                cpf,
                dateBirth,
                rvLength,
                rvPlate,
                touristType,
                tugPlate,
                vehicleType,
                passport
            } = userSchema.parse(request.body)

            const registerUseCase = await makeRegisterUser()
            
            const {user} = await registerUseCase.execute({
                email, 
                password,
                gender,
                name,
                phone,
                cpf,
                dateBirth: new Date(dateBirth),
                rvLength,
                rvPlate,
                touristType,
                tugPlate,
                vehicleType,
                passport
            })
            
            
            return reply.status(201).send(user)
            
          } catch (error) {
            if(error instanceof  EmailAlreadyExistsError){
              return reply.status(409).send({ message: error.message})
            }
            if(error instanceof  CPFAlreadyExistsError){
                return reply.status(401).send({ message: error.message})
            }
            throw error
          }
}
    
