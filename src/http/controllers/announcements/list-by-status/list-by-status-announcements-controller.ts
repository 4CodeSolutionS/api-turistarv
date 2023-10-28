import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeListAnnouncementsByEmphasis } from '@/usecases/factories/announcements/make-list-by-emphasis-announcements-usecase'
import { makeListAnnouncementsByStatus } from '@/usecases/factories/announcements/make-list-by-status-announcements-usecase'
import { Status } from '@prisma/client'

export async function ListByStatus (request: FastifyRequest, reply:FastifyReply){
        try {
            const announcementSchemaParms = z.object({
                status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
            })

            const { status } = announcementSchemaParms.parse(request.query)
           
            const listAnnouncementByStatusUseCase = await makeListAnnouncementsByStatus()
            
            const announcement = await listAnnouncementByStatusUseCase.execute({
              status: status as Status,
            })

            return reply.status(200).send(announcement)
            
          } catch (error) {
            throw error
          }
}
    
