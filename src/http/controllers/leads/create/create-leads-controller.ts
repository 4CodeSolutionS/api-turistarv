import { makeCreateLead } from '@/usecases/factories/leads/make-create-leads-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function CreateLead (request: FastifyRequest, reply:FastifyReply){
        try {
            const userSchema = z.object({
                name: z.string().nonempty().min(4),
                email: z.string().email().nonempty(),
                phone: z.string().nonempty().min(11).max(11),
            })

            const { 
                name,
                email,
                phone,
            } = userSchema.parse(request.body)

            const createLeadUseCase = await makeCreateLead()
            
            const lead = await createLeadUseCase.execute({
                email,
                name,
                phone,
            })
            return reply.status(200).send(lead)
            
          } catch (error) {
            
            throw error
          }
}
    
