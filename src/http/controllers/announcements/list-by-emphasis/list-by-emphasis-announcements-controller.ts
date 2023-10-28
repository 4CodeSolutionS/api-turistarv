import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeListAnnouncementsByEmphasis } from '@/usecases/factories/announcements/make-list-by-emphasis-announcements-usecase'

export async function ListByEmphasis (request: FastifyRequest, reply:FastifyReply){
        try {
            const announcementSchemaParms = z.object({
                emphasis: z.coerce.boolean(),
            })

            const { emphasis } = announcementSchemaParms.parse(request.query)
           
            const listAnnouncementByEmphasisUseCase = await makeListAnnouncementsByEmphasis()
            
            const announcement = await listAnnouncementByEmphasisUseCase.execute({
                emphasis
            })

            return reply.status(200).send(announcement)
            
          } catch (error) {
            throw error
          }
}
    
