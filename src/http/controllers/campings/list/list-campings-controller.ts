import { makeListCamping } from '@/usecases/factories/campings/make-list-campings-usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function ListCamping(request: FastifyRequest, reply:FastifyReply){
        try {
            const listCampingUseCase = await makeListCamping()
            
            const campings = await listCampingUseCase.execute()
            return reply.status(200).send(campings)
            
          } catch (error) {
            
            throw error
          }
}
    
