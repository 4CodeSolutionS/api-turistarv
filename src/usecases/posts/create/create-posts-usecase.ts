import { IStorageProvider } from "@/providers/StorageProvider/storage-provider.interface";
import { IPostsRepository } from "@/repositories/interface-posts-repository";
import { IUsersRepository } from "@/repositories/interface-users-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { Post } from "@prisma/client";

interface IRequestCreatePost {
    idUser: string
    title: string
    body: string
    image: string
}

export class CreatePostUseCase{
    constructor(
       private postsRepository: IPostsRepository,
       private usersRepository: IUsersRepository,
       private storageProvider:  IStorageProvider
    ) {}

    async execute({
      body,
      title,
      idUser,
      image
    }:IRequestCreatePost):Promise<Post>{
        // encontrar usuario pelo id
        const findUserExist = await this.usersRepository.findById(idUser)

        // validar se usuario existe
        if(!findUserExist){
            throw new ResourceNotFoundError()
        }

        // env.FOLDER_TMP
        const pathFolder = './src/tmp/posts'
        // salvar imagem no storage
        const fileName = await this.storageProvider.uploadFile(image, pathFolder, 'turistarv')
        //[x] criar post
        const post = await this.postsRepository.create({
            body,
            title,
            idUser,
            image: fileName as string
        });

        //[x] retornar post
        return post;
    }
}