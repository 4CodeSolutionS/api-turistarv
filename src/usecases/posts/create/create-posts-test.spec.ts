import { beforeEach, describe, expect, test } from "vitest";
import { CreatePostUseCase } from "./create-posts-usecase";
import { InMemoryPostRepository } from "@/repositories/in-memory/in-memory-posts-repository";
import { InMemoryStorageProvider } from "@/providers/StorageProvider/in-memory/in-memory-storage-provider";
import { AppError } from "@/usecases/errors/app-error";

let postInMemoryRepository: InMemoryPostRepository;
let storageProviderInMemory: InMemoryStorageProvider;
let stu: CreatePostUseCase;

describe("Create post (unit)", () => {
    beforeEach(async () => {
        postInMemoryRepository = new InMemoryPostRepository()
        storageProviderInMemory = new InMemoryStorageProvider()
        stu = new CreatePostUseCase(
            postInMemoryRepository,
            storageProviderInMemory
        )

      

    });

    test("Should be able to create a post", async () => {
        const createPost = await stu.execute({
            title: "title",
            body: "body",
            image: "nestjs.png"
        });

        expect(createPost).toEqual(
            expect.objectContaining({
                title: "title",
                body: "body",
            })
        )
    });

    test("Should not be able to create a post with invalid user", async () => {
        await expect(stu.execute({
            title: "title",
            body: "body",
            image: "nestjs.png"
        })).rejects.toEqual(new AppError('Usuário não encontrado', 404))
    });
})