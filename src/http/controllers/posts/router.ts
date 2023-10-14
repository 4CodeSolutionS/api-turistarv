import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { FastifyInstance } from "fastify";
import { CreatePost } from "./create/create-posts-controller";
import { ListPost } from "./list/list-posts-controller";
import { FindPost } from "./find/find-posts-controller";
import { DeletePost } from "./delete/delete-posts-controller";
import { UpdatePost } from "./update-full/update-posts-controller";

export async function postsRoutes(fastifyApp: FastifyInstance) {
    fastifyApp.addHook('onRequest', verifyTokenJWT)
    fastifyApp.addHook('onRequest', verifyUserRole('ADMIN', 'SUPER'))

    //  criar post
    fastifyApp.post('/', 
    {
        onRequest: [
            verifyUserRole('ADMIN','SUPER')
        ]
    }, CreatePost)

    // listar todos os posts
    fastifyApp.get('/', 
    {
        onRequest: [
            verifyUserRole('ADMIN','SUPER')
        ]
    }, ListPost)

    // encontrar um post pelo id
    fastifyApp.get('/:id', 
    {
        onRequest: [
            verifyUserRole('ADMIN','SUPER')
        ]
    }, FindPost)

    // delete um post pelo id
    fastifyApp.delete('/:id', 
    {
        onRequest: [
            verifyUserRole('ADMIN','SUPER')
        ]
    }, DeletePost)

    // atualizar um post pelo id
    fastifyApp.put('/', 
    {
        onRequest: [
            verifyUserRole('ADMIN','SUPER')
        ]
    }, UpdatePost)
}
