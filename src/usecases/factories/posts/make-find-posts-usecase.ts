import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider";
import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository";
import { FindPostUseCase } from "@/usecases/posts/find/find-posts-usecase";

export async function makeFindPost(): Promise<FindPostUseCase> {
    const postsRepository = new PrismaPostsRepository();
    const findPostUseCase = new FindPostUseCase(
        postsRepository,
        )

    return findPostUseCase
}