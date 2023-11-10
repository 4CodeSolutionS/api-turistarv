import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeDeleteCamping } from '@/usecases/factories/campings/make-delete-campings-usecase'

export async function DeleteCamping (request: FastifyRequest, reply:FastifyReply){
        try {
            const campingSchemaParms = z.object({
                id: z.string().uuid(),
            })

            const { id } = campingSchemaParms.parse(request.params)
           
            const deleteCampingUseCase = await makeDeleteCamping()
            
            await deleteCampingUseCase.execute({
               id
            })

            return reply.status(200).send({message: 'Camping deletado com sucesso'})
          } catch (error) {
            throw error
          }
}
    
