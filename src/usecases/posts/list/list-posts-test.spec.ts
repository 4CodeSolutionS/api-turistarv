import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryPostRepository } from "@/repositories/in-memory/in-memory-posts-repository";
import { randomUUID } from "crypto";
import { ListPostUseCase } from "./list-posts-usecase";

let postInMemoryRepository: InMemoryPostRepository;
let stu: ListPostUseCase;

describe("List post (unit)", () => {
    beforeEach(async () => {
        postInMemoryRepository = new InMemoryPostRepository()
       
        stu = new ListPostUseCase(
            postInMemoryRepository,
        )
    });

    test("Should be able to list all post", async () => {
        for(let i = 0; i < 10; i++){
            await postInMemoryRepository.create({
                id: randomUUID(),
                title: "title",
                body: "content",
                date: new Date(),
                image: "http://localhost:3000/image.png",
                active: true,
            })
        }

        const listPost = await stu.execute()

        expect(listPost).toHaveLength(10)
    });

})