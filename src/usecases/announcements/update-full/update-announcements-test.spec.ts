import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { InMemoryAnnouncementRepository } from "@/repositories/in-memory/in-memory-announcement-repository";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { UpdateAnnouncementUseCase } from "./update-announcements-usecase";
import { Prisma } from "@prisma/client";
import { InMemoryStorageProvider } from "@/providers/StorageProvider/in-memory/in-memory-storage-provider";
import { AppError } from "@/usecases/errors/app-error";

let addressRepositoryInMemory: InMemoryAddressesRepository;
let announcementRepositoryInMemory: InMemoryAnnouncementRepository;
let dayjsDateProvider: DayjsDateProvider;
let storageProviderInMemory: InMemoryStorageProvider;
let stu: UpdateAnnouncementUseCase;

describe("Update annoucement (unit)", () => {
    beforeEach(async() => {
        addressRepositoryInMemory = new InMemoryAddressesRepository()
        announcementRepositoryInMemory = new InMemoryAnnouncementRepository(addressRepositoryInMemory)
        dayjsDateProvider = new DayjsDateProvider()
        storageProviderInMemory = new InMemoryStorageProvider()
        stu = new UpdateAnnouncementUseCase(
            announcementRepositoryInMemory, 
            dayjsDateProvider,
            storageProviderInMemory
            
        )

         // criar announcement
         await announcementRepositoryInMemory.create({
            id: 'd3607192-f0aa-4c94-8270-cb2e8ced7a5a',
            title: "title",
            description: "description",
            expirationDate: new Date('2023-12-10'),
            publicationDate: new Date(),
            category: "category",
            price: 100,
            address: {
               create:{
                id: 'a7756513-607d-4218-8e66-7d074f1fe616',
                city: "city",
                complement: "complement",
                district: "district",
                num: new Prisma.Decimal(123),
                state: "state",
                street: "street",
                country: "country",
                zipCode: new Prisma.Decimal(1567894),
                reference: "reference",
               }
            },
            contactInfo: "contactInfo",
            status: "ACTIVE",
            emphasis: true,
            image: "image",
            linkDetails: "linkDetails",
        })

    });

    test("Should be able to update a announcement", async () => {
        const announcement = await stu.execute({ 
            id: 'd3607192-f0aa-4c94-8270-cb2e8ced7a5a', 
            title: "new title",
            description: "new  description",
            expirationDate: new Date('2023-12-19'),
            category: "new category",
            price: 399,
            contactInfo: "new contactInfo",
            status: "EXPIRED",
            emphasis: true,
            image: "new image",
            linkDetails: "new linkDetails",
        });

        expect(announcement).toEqual(
            expect.objectContaining({
                id: 'd3607192-f0aa-4c94-8270-cb2e8ced7a5a', 
                title: "new title",
                description: "new  description",
                image: "new image",
                contactInfo: "new contactInfo",
                linkDetails: "new linkDetails",
            })
        )
    });

    test("Should not be able to update a announcement with invalid id", async () => {
        const fakeId = '955d9d7f-9681-41eb-a513-06c645cb0db6'
        await expect(()=>stu.execute({ 
            id: fakeId, 
            title: "new title",
            description: "new  description",
            expirationDate: new Date('2023-12-19'),
            category: "new category",
            price: 399,
            contactInfo: "new contactInfo",
            status: "EXPIRED",
            emphasis: true,
            image: "new image",
            linkDetails: "new linkDetails",
        })).rejects.toEqual(new AppError('Anúncio não encontrado', 404))
    });
});