import { IPostsRepository } from "@/repositories/interface-posts-repository";
import { Post } from "@prisma/client";

export class ListPostUseCase{
    constructor(
       private postsRepository: IPostsRepository,
    ) {}

    async execute():Promise<Post[]>{
        // encontrar um post pelo id
        const listPost = await this.postsRepository.list()

        // retornar post
        return listPost;
    }
}