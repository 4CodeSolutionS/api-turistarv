import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryCampingRepository } from "@/repositories/in-memory/in-memory-camping-repository";
import { InMemoryStorageProvider } from "@/providers/StorageProvider/in-memory/in-memory-storage-provider";
import { UpdateCampingUseCase } from "./update-campings-usecase";
import { InMemoryImagesRepository } from "@/repositories/in-memory/in-memory-images-repository";
import { AppError } from "@/usecases/errors/app-error";

let campingRepositoryInMemory: InMemoryCampingRepository
let storageProviderInMemory: InMemoryStorageProvider
let imageRepositoryInMemory: InMemoryImagesRepository
let stu: UpdateCampingUseCase;

describe("Update camping (unit)", () => {
    beforeEach(async() => {
        imageRepositoryInMemory = new InMemoryImagesRepository()
        campingRepositoryInMemory = new InMemoryCampingRepository(imageRepositoryInMemory)
        storageProviderInMemory = new InMemoryStorageProvider()
        stu = new UpdateCampingUseCase(
            campingRepositoryInMemory,
            storageProviderInMemory,
            imageRepositoryInMemory
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
                   data: [ { url: "image1.jpg", }, { url: "image2.jpg" } ] 
                }
            }
        });
    });

    test("Should be able to update camping", async () => {
        const camping = await stu.execute({ 
           idCamping: "1edbd710-bfcb-4795-9b99-3aca168cbc88",
           name: "Camping Test 2",
           propertyRules: "Proibido fumar, Proibido animais, Proibido bebidas alcoólicas",
           active: true,
           description: "description camping test 2",
           fileNameImages: ["nestjs.png", "turista-logo.png"]
        });
        expect(camping).toEqual(
            expect.objectContaining({
                id: "1edbd710-bfcb-4795-9b99-3aca168cbc88",
                name: "Camping Test 2",
                propertyRules: "Proibido fumar, Proibido animais, Proibido bebidas alcoólicas",
                active: true,
                description: "description camping test 2",
            })
        )
    });

    test("Should not be able to update camping invalid id", async () => {
        expect(()=>stu.execute({ 
            idCamping: "4809771d-2e33-4139-b5bf-876e2add45c4",
            name: "Camping Test 2",
            propertyRules: "Proibido fumar, Proibido animais, Proibido bebidas alcoólicas",
            active: true,
            description: "description camping test 2",
            fileNameImages: ["nestjs.png", "turista-logo.png"]
         })).rejects.toEqual(new AppError('Camping não existe', 404))
    });

    test("Should not be able to update camping with name exists", async () => {
        expect(()=>stu.execute({ 
            idCamping: "1edbd710-bfcb-4795-9b99-3aca168cbc88",
            name: "Camping Test",
            propertyRules: "Proibido fumar, Proibido animais, Proibido bebidas alcoólicas",
            active: true,
            description: "description camping test 2",
            fileNameImages: ["nestjs.png", "turista-logo.png"]
         })).rejects.toEqual(new AppError('Camping já existe', 409))
    });
});