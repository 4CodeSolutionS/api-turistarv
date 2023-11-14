import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryCampingRepository } from "@/repositories/in-memory/in-memory-camping-repository";
import { InMemoryImagesRepository } from "@/repositories/in-memory/in-memory-images-repository";
import { ListCampingUseCase } from "./list-campings-usecase";

let campingRepositoryInMemory: InMemoryCampingRepository
let imageRepository: InMemoryImagesRepository
let stu: ListCampingUseCase;

describe("List camping (unit)", () => {
    beforeEach(async() => {
        campingRepositoryInMemory = new InMemoryCampingRepository()
        imageRepository = new InMemoryImagesRepository()
        stu = new ListCampingUseCase(
            campingRepositoryInMemory,
        )        
    });

    test("Should be able to delete camping", async () => {
        for(let i = 0; i < 10; i++){
            await campingRepositoryInMemory.create({
                id: '1edbd710-bfcb-4795-9b99-3aca168cbc88',
                name: `Camping Test ${i}`,
                propertyRules: "Proibido fumar, Proibido animais",
                active: true,
                description: "Camping Test",
                images:{
                    createMany:{
                       data: [ { url: "image1.jpg" }, { url: "image2.jpg" } ] 
                    }
                }
            });
        }

        const camping = await stu.execute();

        expect(camping).toHaveLength(10);        
    });
});