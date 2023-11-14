import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryCampingRepository } from "@/repositories/in-memory/in-memory-camping-repository";
import { InMemoryStorageProvider } from "@/providers/StorageProvider/in-memory/in-memory-storage-provider";
import { DeleteCampingUseCase } from "./delete-campings-usecase";
import { InMemoryImagesRepository } from "@/repositories/in-memory/in-memory-images-repository";
import { AppError } from "@/usecases/errors/app-error";

let campingRepositoryInMemory: InMemoryCampingRepository
let imageRepository: InMemoryImagesRepository
let stu: DeleteCampingUseCase;

describe("Create camping (unit)", () => {
    beforeEach(async() => {
        campingRepositoryInMemory = new InMemoryCampingRepository()
        imageRepository = new InMemoryImagesRepository()
        stu = new DeleteCampingUseCase(
            campingRepositoryInMemory,
            imageRepository
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

    test("Should be able to delete camping", async () => {
        const camping = await stu.execute({ 
           id: "1edbd710-bfcb-4795-9b99-3aca168cbc88",
        });
        
        const findCampingExists = await campingRepositoryInMemory.findById("1edbd710-bfcb-4795-9b99-3aca168cbc88");

        expect(findCampingExists).toBeNull();

    });

    test("Should not be able to delete camping with id invalid", async () => {
        expect(()=> stu.execute({ 
            id: "b42f1710-1508-481d-9e96-db641aaa54ea",
         })).rejects.toEqual(new AppError("Camping não encontrado", 404));
    });;
});