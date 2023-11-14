import { FastifyInstance } from "fastify";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { CreateCamping } from "./create/create-campings-controller";
import { ListCamping } from "./list/list-campings-controller";
import { DeleteCamping } from "./delete/delete-camping-usecase";
import { FindCampingById } from "./find-by-id/find-by-id-camping-usecase";
import { UpdateCamping } from "./update-by-id/update-campings-controller";

export async function campingRoutes(fastifyApp: FastifyInstance) {
    // criar camping
    fastifyApp.post('/',{
        onRequest: [verifyTokenJWT, verifyUserRole('ADMIN', 'SUPER')],
    } ,CreateCamping)

    fastifyApp.get('/', ListCamping)
    
    fastifyApp.get('/:id',{
        onRequest: [verifyTokenJWT, verifyUserRole('ADMIN', 'SUPER')],
    }, FindCampingById)

    fastifyApp.put('/',{
        onRequest: [verifyTokenJWT, verifyUserRole('ADMIN', 'SUPER')],
    } ,UpdateCamping)

    fastifyApp.delete('/:id',{
        onRequest: [verifyTokenJWT, verifyUserRole('ADMIN', 'SUPER')],
    }, DeleteCamping)
}
