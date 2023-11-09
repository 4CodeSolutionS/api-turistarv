import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryPostRepository } from "@/repositories/in-memory/in-memory-posts-repository";
import { randomUUID } from "crypto";
import { FindPostUseCase } from "./find-posts-usecase";
import { AppError } from "@/usecases/errors/app-error";

let postInMemoryRepository: InMemoryPostRepository;
let stu: FindPostUseCase;

describe("Find post (unit)", () => {
    beforeEach(async () => {
        postInMemoryRepository = new InMemoryPostRepository()
       
        stu = new FindPostUseCase(
            postInMemoryRepository,
        )
        await postInMemoryRepository.create({
            id: "14f6e34b-333b-4a35-a989-47f8004513ed",
            title: "title",
            body: "body",
            image: "nestjs.png"
        });
    });

    test("Should be able to find a post", async () => {
        const findPost = await stu.execute({
            id: "14f6e34b-333b-4a35-a989-47f8004513ed",
        });

        expect(findPost).toEqual(
            expect.objectContaining({
                idUser: "14f6e34b-333b-4a35-a989-47f8004513ed",
            })
        )
    });

    test("Should not be able to find a post with invalid id", async () => {
        const idFake = randomUUID()

        await expect(()=> stu.execute({
            id: idFake,
        })).rejects.toEqual(new AppError('Post não encontrado', 404))
    });
})