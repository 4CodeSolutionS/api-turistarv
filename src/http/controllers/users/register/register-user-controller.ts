import { CPFAlreadyExistsError } from '@/usecases/errors/cpf-already-exists-error'
import { PassportOrCPFRequiredError } from '@/usecases/errors/cpf-or-passport-required-error'
import { EmailAlreadyExistsError } from '@/usecases/errors/email-already-exists-error'
import { makeRegisterUser } from '@/usecases/factories/users/make-register-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function RegisterUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
              name: z.string().min(4), 
              email: z.string().email(), 
              password: z.string().min(6),
              phone: z.string(), 
              passport: 
                z.string()
                .regex(new RegExp('^(?!^0+$)[a-zA-Z0-9]{6,9}$'), "Passport invalid")
                .optional(),
              cpf: 
                z.string()
                .regex(new RegExp('[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}'), "CPF invalid")
                .optional(), 
              gender: z.enum(['MASCULINO', 'FEMININO']), 
              dateBirth: z.coerce.date(), 
              rvLength: z.number().nonnegative(), 
              tugPlate: z.string().regex(new RegExp('^[A-Z0-9]{1,7}$')).nonempty(), 
              rvPlate: z.string().regex(new RegExp('^[A-Z0-9]{1,7}$')).nonempty(), 
              touristType: z.enum(['CARAVANISTA', 'ADMIRADOR']), 
              vehicleType: z.enum(['MOTORHOME', 'TRAILER', 'CAMPER', 'TENT']), 
            })

            const { 
                email, 
                password,
                dateBirth,
                gender,
                name,
                phone,
                passport,
                cpf,
                rvLength,
                tugPlate,
                rvPlate,
                touristType,
                vehicleType
            } = userSchema.parse(request.body)

            if(!cpf && !passport){
                throw new PassportOrCPFRequiredError()
            }
            
            const registerUseCase = await makeRegisterUser()
            
            const {user} = await registerUseCase.execute({
                email, 
                password,
                dateBirth,
                gender,
                name,
                phone,
                passport,
                cpf,
                rvLength,
                tugPlate,
                rvPlate,
                touristType,
                vehicleType
            })
            
            
            return reply.status(201).send(user)
            
          } catch (error) {
            if(error instanceof  EmailAlreadyExistsError){
              return reply.status(409).send({ message: error.message})
            }
            if(error instanceof  PassportOrCPFRequiredError){
                return reply.status(401).send({ message: error.message})
            }
            if(error instanceof  CPFAlreadyExistsError){
                return reply.status(401).send({ message: error.message})
            }
            throw error
          }
}
    
