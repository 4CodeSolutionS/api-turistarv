import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider";
import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { CreatePostUseCase } from "@/usecases/posts/create/create-posts-usecase";

export async function makeCreatePost(): Promise<CreatePostUseCase> {
    const usersRepository = new PrismaUsersRepository();
    const postsRepository = new PrismaPostsRepository();
    const storageProvider = new FirebaseStorageProvider()
    const createPostUseCase = new CreatePostUseCase(
        postsRepository,
        usersRepository, 
        storageProvider)

    return createPostUseCase
}