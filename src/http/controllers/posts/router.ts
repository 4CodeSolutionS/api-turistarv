import { tmpDirectoriesUploadConfig } from "@/config/multer-upload-files";
import { verifyTokenJWT } from "@/http/middlewares/verify-token-jwt";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";
import { FastifyInstance } from "fastify";
import multer from "fastify-multer";
import { CreatePost } from "./create/create-posts-controller";

const {posts} = tmpDirectoriesUploadConfig

const uploadPostsImage = multer(posts)

export async function postsRoutes(fastifyApp: FastifyInstance) {
    fastifyApp.addHook('onRequest', verifyTokenJWT)
    fastifyApp.addHook('onRequest', verifyUserRole('ADMIN', 'SUPER'))

    fastifyApp.post('/', 
    {
        onRequest: [
            uploadPostsImage.array('posts'),
            verifyUserRole('ADMIN','SUPER')
        ]
    }, CreatePost)
}
