import { env } from "@/env";
import { IStorageProvider } from "@/providers/StorageProvider/storage-provider.interface";
import { IPostsRepository } from "@/repositories/interface-posts-repository";
import { IUsersRepository } from "@/repositories/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Post } from "@prisma/client";

interface IRequestUpdatePost {
    id:string
    title: string
    body: string
    image: string
    active: boolean
}

export class UpdatePostUseCase{
    constructor(
       private postsRepository: IPostsRepository,
       private storageProvider:  IStorageProvider
    ) {}

    async execute({
      id,
      body,
      title,
      image,
      active
    }:IRequestUpdatePost):Promise<Post>{
        // encontrar um post pelo id
        const findPost = await this.postsRepository.findById(id)

        // validar se post existe
        if(!findPost){
            throw new AppError('Post não encontrado', 404)   
        }
        
        // env.FOLDER_TMP
        const pathFolder = env.NODE_ENV === "production" ? `${env.FOLDER_TMP_PRODUCTION}/posts` : `${env.FOLDER_TMP_DEVELOPMENT}/posts`
        
        // salvar imagem no storage
         const fileName = await this.storageProvider.uploadFile(image, pathFolder, 'posts')
        // atualizar post
        const post = await this.postsRepository.updateById({
            id,
            title,
            body,
            image: fileName as string,
            active
        })

        // retornar post atualizado
        return post;
    }
}