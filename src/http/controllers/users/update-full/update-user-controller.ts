import { makeUpdateUser } from '@/usecases/factories/users/make-update-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import {cpf as CPF} from 'cpf-cnpj-validator'
import { z } from 'zod'

export async function UpdateUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchemaBody = z.object({
              id: z.string().uuid().nonempty(),
              name: z.string().min(4).nonempty(), 
              cpf: z.string().refine((cpf)=>{
                return CPF.isValid(cpf)
              }).optional(),  
              passport: z.string().optional(),
              phone: z.string().nonempty(), 
              dateBirth: z.string().nonempty().refine((date) => {
                const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
                return dateRegex.test(date)
            }),
            })

            const { 
                id,
                name,
                phone,
                dateBirth,
                cpf,
                passport

            } = userSchemaBody.parse(request.body)

            const updateUserUseCase = await makeUpdateUser()
            
            const {user} = await updateUserUseCase.execute({
                id,
                name,
                phone,
                dateBirth: new Date(dateBirth),
                cpf: CPF.format(cpf as string),
                passport
            })
            
            
            return reply.status(200).send(user)
            
          } catch (error) {
            throw error
          }
}
    
