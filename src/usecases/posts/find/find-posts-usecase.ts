import { IPostsRepository } from "@/repositories/interface-posts-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { Post } from "@prisma/client";

interface IRequestFindPost {
    id: string
}

export class FindPostUseCase{
    constructor(
       private postsRepository: IPostsRepository,
    ) {}

    async execute({
      id,
    }:IRequestFindPost):Promise<Post>{
        // encontrar um post pelo id
        const findPost = await this.postsRepository.findById(id)

        // validar se post existe
        if(!findPost){
            throw new ResourceNotFoundError()
        }

        // retornar post
        return findPost;
    }
}