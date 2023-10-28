import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryLeadsRepository } from "@/repositories/in-memory/in-memory-leads-repository";
import { CreateLeadUseCase } from "./create-leads-usecase";
import { AppError } from "@/usecases/errors/app-error";

let leadInMemoryRepository: InMemoryLeadsRepository;
let stu: CreateLeadUseCase;

describe("Create lead (unit)", () => {
    beforeEach(async () => {
        leadInMemoryRepository = new InMemoryLeadsRepository()
        stu = new CreateLeadUseCase(
            leadInMemoryRepository, 
        )

        await leadInMemoryRepository.create({
            email: 'email2@email.com',
            name: 'name test',
            phone: '77777777777',
        })
    });

    test("Should be able to create a lead", async () => {
        const createLead = await stu.execute({
            email: 'email1@test.com',
            name: 'name test',
            phone: '77777777777',
        });
        
        expect(createLead).toEqual(
            expect.objectContaining({
                email: 'email1@test.com',
                name: 'name test',
                phone: '77777777777',
            })
        );
    });

    test("Should be able to create a lead", async () => {
        await expect(()=> stu.execute({
            email: 'email2@email.com',
            name: 'name test',
            phone: '77777777777',
        
        })).rejects.toEqual(new AppError('Lead já cadastrado', 409))
    });
})