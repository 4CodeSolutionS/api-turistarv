import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryPostRepository } from "@/repositories/in-memory/in-memory-posts-repository";
import { randomUUID } from "crypto";
import { DeletePostUseCase } from "./delete-posts-usecase";
import { AppError } from "@/usecases/errors/app-error";

let postInMemoryRepository: InMemoryPostRepository;
let stu: DeletePostUseCase;

describe("Delete post (unit)", () => {
    beforeEach(async () => {
        postInMemoryRepository = new InMemoryPostRepository()
       
        stu = new DeletePostUseCase(
            postInMemoryRepository,
        )
        await postInMemoryRepository.create({
            id: "14f6e34b-333b-4a35-a989-47f8004513ed",
            idUser: "14f6e34b-333b-4a35-a989-47f8004513ed",
            title: "title",
            body: "body",
            image: "nestjs.png"
        });
    });

    test("Should be able to find a post", async () => {
        const deletePost = await stu.execute({
            id: "14f6e34b-333b-4a35-a989-47f8004513ed",
        });

        expect(deletePost).toEqual(true)
    });

    test("Should not be able to delete a post with invalid id", async () => {
        const idFake = randomUUID()

        await expect(()=> stu.execute({
            id: idFake,
        })).rejects.toEqual(new AppError('Post não encontrado', 404))  
    });
})