import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { InMemoryAnnouncementRepository } from "@/repositories/in-memory/in-memory-announcement-repository";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { CreateAnnouncementUseCase } from "./create-announcements-usecase";
import { Address, Prisma } from "@prisma/client";
import { InMemoryStorageProvider } from "@/providers/StorageProvider/in-memory/in-memory-storage-provider";
import { AppError } from "@/usecases/errors/app-error";

let addressRepositoryInMemory: InMemoryAddressesRepository;
let announcementRepositoryInMemory: InMemoryAnnouncementRepository;
let dayjsDateProvider: DayjsDateProvider;
let storageProviderInMemory: InMemoryStorageProvider;
let stu: CreateAnnouncementUseCase;

describe("Create annoucement (unit)", () => {
    beforeEach(async() => {
        addressRepositoryInMemory = new InMemoryAddressesRepository()
        announcementRepositoryInMemory = new InMemoryAnnouncementRepository(addressRepositoryInMemory)
        dayjsDateProvider = new DayjsDateProvider()
        storageProviderInMemory = new InMemoryStorageProvider()
        stu = new CreateAnnouncementUseCase(
            announcementRepositoryInMemory, 
            dayjsDateProvider,
            storageProviderInMemory           
        )

    });

    test("Should be able to create a announcement", async () => {
        const announcement = await stu.execute({ 
            title: "title",
            description: "description",
            expirationDate: new Date('2023-12-10'),
            category: "category",
            price: 100,
            address: {
                city: "city",
                complement: "complement",
                district: "district",
                num: new Prisma.Decimal(123),
                state: "state",
                street: "street",
                country: "country",
                zipCode: new Prisma.Decimal(1567894),
                reference: "reference",
            } as Address,
            contactInfo: "contactInfo",
            status: "ACTIVE",
            emphasis: true,
            image: "image",
            linkDetails: "linkDetails",
        });
    });

    test("Should not be able to create a announcement with title equal", async () => {
        const announcement = await stu.execute({ 
            title: "title 1",
            description: "description",
            expirationDate: new Date('2023-12-10'),
            category: "category",
            price: 100,
            address: {
                city: "city",
                complement: "complement",
                district: "district",
                num: new Prisma.Decimal(123),
                state: "state",
                street: "street",
                country: "country",
                zipCode: new Prisma.Decimal(1567894),
                reference: "reference",
            } as Address,
            contactInfo: "contactInfo",
            status: "ACTIVE",
            emphasis: true,
            image: "image",
            linkDetails: "linkDetails",
        });

        await expect(()=>stu.execute({ 
            title: "title 1",
            description: "description",
            expirationDate: new Date('2023-12-10'),
            category: "category",
            price: 100,
            address: {
                city: "city",
                complement: "complement",
                district: "district",
                num: new Prisma.Decimal(123),
                state: "state",
                street: "street",
                country: "country",
                zipCode: new Prisma.Decimal(1567894),
                reference: "reference",
            } as Address,
            contactInfo: "contactInfo",
            status: "ACTIVE",
            emphasis: true,
            image: "image",
            linkDetails: "linkDetails",
        })).rejects.toEqual(new AppError('Anúncio já cadastrado', 409))
    });

    test("Should not be able to create a announcement with expirationDate les publicationDate", async () => {
        await expect(()=>stu.execute({ 
            title: "title 2",
            description: "description",
            expirationDate: new Date('2021-12-10'),
            category: "category",
            price: 100,
            address: {
                city: "city",
                complement: "complement",
                district: "district",
                num: new Prisma.Decimal(123),
                state: "state",
                street: "street",
                country: "country",
                zipCode: new Prisma.Decimal(1567894),
                reference: "reference",
            } as Address,
            contactInfo: "contactInfo",
            status: "ACTIVE",
            emphasis: true,
            image: "image",
            linkDetails: "linkDetails",
        })).rejects.toEqual(new AppError('Data de expiração inválida', 400))
    });
});