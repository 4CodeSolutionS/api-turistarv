import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { InMemoryAnnouncementRepository } from "@/repositories/in-memory/in-memory-announcement-repository";
import { Prisma } from "@prisma/client";
import { DeleteAnnouncementUseCase } from "./delete-announcement-usecase";
import { AppError } from "@/usecases/errors/app-error";

let addressRepositoryInMemory: InMemoryAddressesRepository;
let announcementRepositoryInMemory: InMemoryAnnouncementRepository;
let stu: DeleteAnnouncementUseCase;

describe("Create annoucement (unit)", () => {
    beforeEach(async() => {
        addressRepositoryInMemory = new InMemoryAddressesRepository()
        announcementRepositoryInMemory = new InMemoryAnnouncementRepository(addressRepositoryInMemory)
        stu = new DeleteAnnouncementUseCase(
            announcementRepositoryInMemory, 
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
            views: 0,
            rate: 0,
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

    test("Should be able to delete a announcement", async () => {
        await stu.execute({ 
            id: 'd3607192-f0aa-4c94-8270-cb2e8ced7a5a'
        });

        const findAnnouncement = await announcementRepositoryInMemory.findById('d3607192-f0aa-4c94-8270-cb2e8ced7a5a');

        expect(findAnnouncement).toBeNull();
    });

    test("Should not be able to delete a announcement with id invalid", async () => {
        const fakeId = 'bd353aba-0026-4853-bdc7-a5ed84caf712'
        await expect(()=> stu.execute({ 
            id: fakeId
        })).rejects.toEqual(new AppError('Anúncio não encontrado', 404));
    });
});