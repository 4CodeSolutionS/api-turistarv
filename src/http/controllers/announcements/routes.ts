import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { FastifyInstance } from "fastify";
import { CreateAnnouncement } from "./create/create-announcements-controller";
import { DeleteAnnouncement } from "./delete/delete-announcements-controller";
import { ListByEmphasis } from "./list-by-emphasis/list-by-emphasis-announcements-controller";
import { ListByStatus } from "./list-by-status/list-by-status-announcements-controller";
import { UpdateAnnouncement } from "./update-full/update-announcements-controller";


export async function announcementsRoutes(fastifyApp: FastifyInstance) {
    fastifyApp.addHook('onRequest', verifyTokenJWT)
    fastifyApp.addHook('onRequest', verifyUserRole('ADMIN', 'SUPER'))

    // criar post
    fastifyApp.post('/', CreateAnnouncement)

    // list by emphasis
    fastifyApp.get('/emphasis', ListByEmphasis)

    // list by status
    fastifyApp.get('/status', ListByStatus)

    // criar post
    fastifyApp.put('/', UpdateAnnouncement)

    // delete post
    fastifyApp.delete('/:id', DeleteAnnouncement)
}
