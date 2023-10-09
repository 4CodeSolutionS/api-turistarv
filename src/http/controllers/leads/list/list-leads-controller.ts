import { makeListLead } from '@/usecases/factories/leads/make-list-leads-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function ListLead (request: FastifyRequest, reply:FastifyReply){
        try {
            const listLeadUseCase = await makeListLead()
            
            const leads = await listLeadUseCase.execute()
            
            return reply.status(200).send(leads)
            
          } catch (error) {
            throw error
          }
}
    
