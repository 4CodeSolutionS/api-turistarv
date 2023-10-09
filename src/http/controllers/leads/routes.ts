import { FastifyInstance } from "fastify";
import { CreateLead } from "./create/create-leads-controller";
import { ListLead } from "./list/list-leads-controller";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";

export async function leadsRoutes(fastifyApp: FastifyInstance) {
    // criar lead
    fastifyApp.post('/', CreateLead)

    // listar leads
    fastifyApp.get('/', {
        onRequest: [verifyTokenJWT],
    }, ListLead)
}
