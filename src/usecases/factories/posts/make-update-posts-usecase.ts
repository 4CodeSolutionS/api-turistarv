import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UpdatePostUseCase } from "@/usecases/posts/update-full/update-posts-usecase";

export async function makeUpdatePost(): Promise<UpdatePostUseCase> {
    const usersRepository = new PrismaUsersRepository();
    const postsRepository = new PrismaPostsRepository();
    const updatePostUseCase = new UpdatePostUseCase(
        postsRepository,
        usersRepository, 
        )

    return updatePostUseCase
}