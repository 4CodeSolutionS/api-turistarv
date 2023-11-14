import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFindCampingById } from '@/usecases/factories/campings/make-find-by-id-campings-usecase'

export async function FindCampingById (request: FastifyRequest, reply:FastifyReply){
        try {
            const campingSchemaParms = z.object({
                id: z.string().uuid(),
            })

            const { id } = campingSchemaParms.parse(request.params)
           
            const findCampingUseCase = await makeFindCampingById()
            
            const camping = await findCampingUseCase.execute({
               id
            })

            return reply.status(200).send(camping)
          } catch (error) {
            throw error
          }
}
    
