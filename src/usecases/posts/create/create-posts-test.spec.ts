import { beforeEach, describe, expect, test } from "vitest";
import { LeadAlreadyExistsError } from "@/usecases/errors/lead-already-exists-error";
import { CreatePostUseCase } from "./create-posts-usecase";
import { InMemoryPostRepository } from "@/repositories/in-memory/in-memory-posts-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { InMemoryStorageProvider } from "@/providers/StorageProvider/in-memory/in-memory-storage-provider";
import { randomUUID } from "crypto";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

let postInMemoryRepository: InMemoryPostRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let storageProviderInMemory: InMemoryStorageProvider;
let stu: CreatePostUseCase;

describe("Create post (unit)", () => {
    beforeEach(async () => {
        postInMemoryRepository = new InMemoryPostRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository()
        storageProviderInMemory = new InMemoryStorageProvider()
        stu = new CreatePostUseCase(
            postInMemoryRepository,
            usersRepositoryInMemory,
            storageProviderInMemory
        )

        await usersRepositoryInMemory.create({
            id: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
            email: 'email1@test.com',
            name: 'Kaio Moreira',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        }); 

    });

    test("Should be able to create a post", async () => {
        const createPost = await stu.execute({
            idUser: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
            title: "title",
            body: "body",
            image: "nestjs.png"
        });

        expect(createPost).toEqual(
            expect.objectContaining({
                idUser: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
                title: "title",
                body: "body",
            })
        )
    });

    test("Should not be able to create a post with invalid user", async () => {
        const idUserFake = randomUUID()

        await expect(stu.execute({
            idUser: idUserFake,
            title: "title",
            body: "body",
            image: "nestjs.png"
        })).rejects.toEqual(new ResourceNotFoundError)
    });
})