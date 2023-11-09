import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider";
import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UpdatePostUseCase } from "@/usecases/posts/update-full/update-posts-usecase";

export async function makeUpdatePost(): Promise<UpdatePostUseCase> {
    const postsRepository = new PrismaPostsRepository();
    const storageProvider = new FirebaseStorageProvider()
    const updatePostUseCase = new UpdatePostUseCase(
        postsRepository,
        storageProvider
        )

    return updatePostUseCase
}