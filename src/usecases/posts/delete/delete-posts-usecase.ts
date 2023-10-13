import { IPostsRepository } from "@/repositories/interface-posts-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestDeletePost {
    id: string
}

export class DeletePostUseCase{
    constructor(
       private postsRepository: IPostsRepository,
    ) {}

    async execute({
      id,
    }:IRequestDeletePost):Promise<boolean>{
        // encontrar um post pelo id
        const findPost = await this.postsRepository.findById(id)

        // validar se post existe
        if(!findPost){
            throw new ResourceNotFoundError()
        }

        // deletar post
        await this.postsRepository.deleteById(id)

        return true;
    }
}