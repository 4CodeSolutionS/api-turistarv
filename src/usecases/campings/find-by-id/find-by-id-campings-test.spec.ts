import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryCampingRepository } from "@/repositories/in-memory/in-memory-camping-repository";
import { InMemoryImagesRepository } from "@/repositories/in-memory/in-memory-images-repository";
import { AppError } from "@/usecases/errors/app-error";
import { FindCampingUseCase } from "./find-by-id-campings-usecase";

let campingRepositoryInMemory: InMemoryCampingRepository
let imageRepository: InMemoryImagesRepository
let stu: FindCampingUseCase;

describe("Find camping (unit)", () => {
    beforeEach(async() => {
        campingRepositoryInMemory = new InMemoryCampingRepository()
        imageRepository = new InMemoryImagesRepository()
        stu = new FindCampingUseCase(
            campingRepositoryInMemory,
        )

        // criar camping
        await campingRepositoryInMemory.create({
            id: '1edbd710-bfcb-4795-9b99-3aca168cbc88',
            name: "Camping Test",
            propertyRules: "Proibido fumar, Proibido animais",
            active: true,
            description: "Camping Test",
            images:{
                createMany:{
                   data: [ { url: "image1.jpg" }, { url: "image2.jpg" } ] 
                }
            }
        });
    });

    test("Should be able to find camping", async () => {
        const camping = await stu.execute({ 
           id: "1edbd710-bfcb-4795-9b99-3aca168cbc88",
        });

        expect(camping).toEqual(
            expect.objectContaining({
                id: '1edbd710-bfcb-4795-9b99-3aca168cbc88',
                name: "Camping Test",
                propertyRules: "Proibido fumar, Proibido animais",
                active: true,
                description: "Camping Test",
            })
        )

    });

    test("Should not be able to find camping with id invalid", async () => {
        expect(()=> stu.execute({ 
            id: "b42f1710-1508-481d-9e96-db641aaa54ea",
         })).rejects.toEqual(new AppError("Camping não encontrado", 404));
    });;
});