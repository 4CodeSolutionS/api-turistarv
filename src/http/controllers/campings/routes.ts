import { FastifyInstance } from "fastify";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { CreateCamping } from "./create/create-campings-controller";
import { ListCamping } from "./list/list-campings-controller";
import { DeleteCamping } from "./delete/delete-camping-usecase";

export async function campingRoutes(fastifyApp: FastifyInstance) {
    // criar camping
    fastifyApp.post('/',{
        onRequest: [verifyTokenJWT, verifyUserRole('ADMIN', 'SUPER')],
    } ,CreateCamping)

    fastifyApp.get('/', ListCamping)

    fastifyApp.delete('/',{
        onRequest: [verifyTokenJWT, verifyUserRole('ADMIN', 'SUPER')],
    }, DeleteCamping)
}
