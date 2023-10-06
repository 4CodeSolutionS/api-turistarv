import { CPFAlreadyExistsError } from '@/usecases/errors/cpf-already-exists-error'
import { EmailAlreadyExistsError } from '@/usecases/errors/email-already-exists-error'
import { PassportAlreadyExistsError } from '@/usecases/errors/passport-already-exist-error'
import { makeRegisterUser } from '@/usecases/factories/users/make-register-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import {cpf as CPF} from 'cpf-cnpj-validator'
import { CPFInvalidError } from '@/usecases/errors/cpf-invalid-error'

export async function RegisterUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
              name: z.string().min(4).nonempty(), 
              email: z.string().email().nonempty(), 
              password: z.string().min(6).nonempty(),
              phone: z.string().nonempty().optional(), 
              gender: z.enum(['MASCULINO', 'FEMININO', 'OUTRO']).optional(), 
              rvLength: z.number().nonnegative().optional(),
              rvPlate: z.string().nonempty().optional(),
              touristType: z.enum(['CARAVANISTA', 'ADMIRADOR']),
              vehicleType: z.enum(['MOTORHOME', 'TRAILER', 'CAMPER', 'TENT']).optional(),
            })

            const { 
                email, 
                password,
                gender,
                name,
                phone,
                rvLength,
                rvPlate,
                touristType,
                vehicleType,
            } = userSchema.parse(request.body)
          
            const registerUseCase = await makeRegisterUser()
            
            const {user} = await registerUseCase.execute({
                email, 
                password,
                gender,
                name,
                phone,
                rvLength,
                rvPlate,
                vehicleType,
                touristType,
            })
            
            
            return reply.status(201).send(user)
            
          } catch (error) {
            if(error instanceof  EmailAlreadyExistsError){
              return reply.status(409).send({ message: error.message})
            }
            if(error instanceof  CPFAlreadyExistsError){
                return reply.status(409).send({ message: error.message})
            }
            if(error instanceof  PassportAlreadyExistsError){
              return reply.status(409).send({ message: error.message})
            }
            if(error instanceof  CPFInvalidError){
              return reply.status(401).send({ message: error.message})
            }
            throw error
          }
}
    
