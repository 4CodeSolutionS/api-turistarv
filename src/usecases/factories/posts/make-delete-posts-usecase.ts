import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository";
import { DeletePostUseCase } from "@/usecases/posts/delete/delete-posts-usecase";

export async function makeDeletePost(): Promise<DeletePostUseCase> {
    const postsRepository = new PrismaPostsRepository();
    const deletePostUseCase = new DeletePostUseCase(
        postsRepository,
        )

    return deletePostUseCase
}