import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryPostRepository } from "@/repositories/in-memory/in-memory-posts-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { randomUUID } from "crypto";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { FindPostUseCase } from "./find-posts-usecase";
import { CreatePostUseCase } from "../create/create-posts-usecase";

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
            idUser: "14f6e34b-333b-4a35-a989-47f8004513ed",
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
        })).rejects.toEqual(new ResourceNotFoundError)
    });
})