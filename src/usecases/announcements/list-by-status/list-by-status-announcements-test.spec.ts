import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { InMemoryAnnouncementRepository } from "@/repositories/in-memory/in-memory-announcement-repository";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { ListAnnouncementByStatusUseCase } from "./list-by-status-announcement-usecase";

let addressRepositoryInMemory: InMemoryAddressesRepository;
let announcementRepositoryInMemory: InMemoryAnnouncementRepository;
let stu: ListAnnouncementByStatusUseCase;

describe("List annoucement by status (unit)", () => {
    beforeEach(async() => {
        addressRepositoryInMemory = new InMemoryAddressesRepository()
        announcementRepositoryInMemory = new InMemoryAnnouncementRepository(addressRepositoryInMemory)
        stu = new ListAnnouncementByStatusUseCase(
            announcementRepositoryInMemory, 
        )

    });

    test("Should be able to list all announcement", async () => {
        for(let i =0 ; i < 10; i++){
             // criar announcement
            await announcementRepositoryInMemory.create({
                id: randomUUID(),
                title: `title ${i}`,
                description: "description",
                publicationDate: new Date(),
                expirationDate: new Date('2023-12-10'),
                category: "category",
                price: 100,
                views: 0,
                rate: 0,
                address: {
                create:{
                    id: randomUUID(),
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
        }
        
        const announcements = await stu.execute({ 
            status: 'ACTIVE'
        });

        expect(announcements.length).toBe(10);
    });
});