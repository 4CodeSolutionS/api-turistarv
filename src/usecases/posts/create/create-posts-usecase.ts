import { env } from "@/env";
import { IStorageProvider } from "@/providers/StorageProvider/storage-provider.interface";
import { IPostsRepository } from "@/repositories/interface-posts-repository";
import { IUsersRepository } from "@/repositories/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Post } from "@prisma/client";

interface IRequestCreatePost {
    title: string
    body: string
    image: string
}

export class CreatePostUseCase{
    constructor(
       private postsRepository: IPostsRepository,
       private storageProvider:  IStorageProvider
    ) {}

    async execute({
      body,
      title,
      image
    }:IRequestCreatePost):Promise<Post>{
        const pathFolder = env.NODE_ENV === "production" ? `${env.FOLDER_TMP_PRODUCTION}/posts` : `${env.FOLDER_TMP_DEVELOPMENT}/posts`

        // salvar imagem no storage
        const fileName = await this.storageProvider.uploadFile(image, pathFolder, 'posts')
        //[x] criar post
        const post = await this.postsRepository.create({
            body,
            title,
            image: fileName as string
        });

        //[x] retornar post
        return post;
    }
}