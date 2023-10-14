import { IStorageProvider } from "@/providers/StorageProvider/storage-provider.interface";
import { IPostsRepository } from "@/repositories/interface-posts-repository";
import { IUsersRepository } from "@/repositories/interface-users-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { Post } from "@prisma/client";

interface IRequestUpdatePost {
    id:string
    idUser: string
    title: string
    body: string
    image: string
}

export class UpdatePostUseCase{
    constructor(
       private postsRepository: IPostsRepository,
       private usersRepository: IUsersRepository,
    ) {}

    async execute({
      id,
      body,
      title,
      idUser,
      image
    }:IRequestUpdatePost):Promise<Post>{
        // encontrar um post pelo id
        const findPost = await this.postsRepository.findById(id)

        // validar se post existe
        if(!findPost){
            throw new ResourceNotFoundError()
        }
        
        // encontrar usuario pelo id
        const findUserExist = await this.usersRepository.findById(idUser)

        // validar se usuario existe
        if(!findUserExist){
            throw new ResourceNotFoundError()
        }

        // atualizar post
        const post = await this.postsRepository.updateById({
            id,
            title,
            body,
            image
        })

        // retornar post atualizado
        return post;
    }
}