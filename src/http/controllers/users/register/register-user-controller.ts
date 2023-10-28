import { AppError } from '@/usecases/errors/app-error'
import { makeRegisterUser } from '@/usecases/factories/users/make-register-user-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function RegisterUser (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
              name: z.string().min(4).nonempty(), 
              email: z.string().email().nonempty(), 
              password: z.string().min(6).nonempty(),
              phone: z.string().optional(), 
              rvLength: z.number().optional(),
              rvPlate: z.string().optional(),
              touristType: z.enum(['CARAVANISTA', 'ADMIRADOR']),
              vehicleType: z.enum(['MOTORHOME', 'TRAILER', 'CAMPER', 'TENT']).optional(),
            })

            const { 
                email, 
                password,
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
                name,
                phone,
                rvLength,
                rvPlate,
                vehicleType,
                touristType,
            })
            return reply.status(201).send(user)
            
          } catch (error) {
            throw error
          }
}
    
