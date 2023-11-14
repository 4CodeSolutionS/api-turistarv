import { beforeEach, describe, expect, test } from "vitest";
import { CreateCampingUseCase } from "./create-campings-usecase";
import { InMemoryCampingRepository } from "@/repositories/in-memory/in-memory-camping-repository";
import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider";
import { InMemoryStorageProvider } from "@/providers/StorageProvider/in-memory/in-memory-storage-provider";

let campingRepositoryInMemory: InMemoryCampingRepository
let storageProviderInMemory: InMemoryStorageProvider
let stu: CreateCampingUseCase;

describe("Create camping (unit)", () => {
    beforeEach(async() => {
        campingRepositoryInMemory = new InMemoryCampingRepository()
        storageProviderInMemory = new InMemoryStorageProvider()
        stu = new CreateCampingUseCase(
            campingRepositoryInMemory,
            storageProviderInMemory
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

    test("Should be able to create camping", async () => {
        const camping = await stu.execute({ 
           name: "Camping Test",
           propertyRules: "Proibido fumar, Proibido animais",
           active: true,
           description: "Camping Test",
           fileNameImages: ["nestjs.png", "turista-logo.png"]
        });
        expect(camping).toEqual(
            expect.objectContaining({
                name: 'Camping Test',
                propertyRules: 'Proibido fumar, Proibido animais',
                active: true,
                images: expect.objectContaining({
                    createMany: expect.objectContaining({
                        data: expect.arrayContaining([
                            expect.objectContaining({
                                url: expect.any(String)
                            })
                        ])
                    })
                })
            })
        )
    });
});