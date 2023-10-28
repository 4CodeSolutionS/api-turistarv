import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryPostRepository } from "@/repositories/in-memory/in-memory-posts-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { UpdatePostUseCase } from "./update-posts-usecase";
import { InMemoryStorageProvider } from "@/providers/StorageProvider/in-memory/in-memory-storage-provider";
import { AppError } from "@/usecases/errors/app-error";

let postInMemoryRepository: InMemoryPostRepository;
let storageProviderInMemory: InMemoryStorageProvider;
let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: UpdatePostUseCase;

describe("Update post (unit)", () => {
    beforeEach(async () => {
        postInMemoryRepository = new InMemoryPostRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository()
        storageProviderInMemory = new InMemoryStorageProvider()
        stu = new UpdatePostUseCase(
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

        await postInMemoryRepository.create({
            id: "4c6f1fd5-259c-444b-a229-3357e8944e68",
            idUser: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
            title: "title",
            body: "body",
            image: "nestjs.png"
        })

    });

    test("Should be able to update a post", async () => {
        const updatePost = await stu.execute({
            id: "4c6f1fd5-259c-444b-a229-3357e8944e68",
            idUser: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
            title: "title updated",
            body: "body updated",
            image: "nestjs.png 2",
            active: true,
        });

        expect(updatePost).toEqual(
            expect.objectContaining({
                id: "4c6f1fd5-259c-444b-a229-3357e8944e68",
                idUser: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
                title: "title updated",
                body: "body updated",
                image: "nestjs.png 2",
                active: true,
            })
        )
    });

    test("Should not be able to update a post with invalid user", async () => {
        const idUserFake = randomUUID()

        await expect(stu.execute({
            id: "4c6f1fd5-259c-444b-a229-3357e8944e68",
            idUser: idUserFake,
            title: "title",
            body: "body",
            image: "nestjs.png",
            active: true,
        })).rejects.toEqual(new AppError('Usuário não encontrado', 404))
    });

    test("Should not be able to update a post with invalid id", async () => {
        await expect(stu.execute({
            id: randomUUID(),
            idUser: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
            title: "title",
            body: "body",
            image: "nestjs.png",
            active: true,
        })).rejects.toEqual(new AppError('Post não encontrado', 404))
    });
})