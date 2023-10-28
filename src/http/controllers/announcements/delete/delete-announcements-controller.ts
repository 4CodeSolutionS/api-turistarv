import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeDeleteAnnouncements } from '@/usecases/factories/announcements/make-delete-announcements-usecase'

export async function DeleteAnnouncement (request: FastifyRequest, reply:FastifyReply){
        try {
            const announcementSchemaParms = z.object({
                id: z.string().uuid(),
            })

            const { id } = announcementSchemaParms.parse(request.params)
           
            const deleteAnnouncementUseCase = await makeDeleteAnnouncements()
            
            const announcement = await deleteAnnouncementUseCase.execute({
               id
            })

            return reply.status(200).send(announcement)
            
          } catch (error) {
            
            throw error
          }
}
    
