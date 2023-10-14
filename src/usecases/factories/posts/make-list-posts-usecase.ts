import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider";
import { PrismaPostsRepository } from "@/repositories/prisma/prisma-posts-repository";
import { FindPostUseCase } from "@/usecases/posts/find/find-posts-usecase";
import { ListPostUseCase } from "@/usecases/posts/list/list-posts-usecase";

export async function makeListPost(): Promise<ListPostUseCase> {
    const postsRepository = new PrismaPostsRepository();
    const listPostUseCase = new ListPostUseCase(
        postsRepository,
        )

    return listPostUseCase
}