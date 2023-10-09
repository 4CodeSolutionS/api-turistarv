import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryLeadsRepository } from "@/repositories/in-memory/in-memory-leads-repository";
import { LeadAlreadyExistsError } from "@/usecases/errors/lead-already-exists-error";
import { ListLeadUseCase } from "./list-leads-usecase";
import { CreateLeadUseCase } from "../create/create-leads-usecase";

let leadInMemoryRepository: InMemoryLeadsRepository;
let createLeadUseCase: CreateLeadUseCase;
let stu: ListLeadUseCase;

describe("List lead (unit)", () => {
    beforeEach(async () => {
        leadInMemoryRepository = new InMemoryLeadsRepository()
        createLeadUseCase = new CreateLeadUseCase(leadInMemoryRepository)
        stu = new ListLeadUseCase(
            leadInMemoryRepository, 
        )
    });

    test("Should be able to create a lead", async () => {
        for(let i = 1; i < 6; i++){
            await createLeadUseCase.execute({
                email: `email${i}@test.com`,
                name: 'name test',
                phone: '77777777777',
            });
        }

        const listLead = await stu.execute();
        
        expect(listLead).toEqual([
            expect.objectContaining({
                email: 'email1@test.com',
                name: 'name test',
                phone: '77777777777',
            }),
            expect.objectContaining({
                email: 'email2@test.com',
                name: 'name test',
                phone: '77777777777',
            }),
            expect.objectContaining({
                email: 'email3@test.com',
                name: 'name test',
                phone: '77777777777',
            }),
            expect.objectContaining({
                email: 'email4@test.com',
                name: 'name test',
                phone: '77777777777',
            }),
            expect.objectContaining({
                email: 'email5@test.com',
                name: 'name test',
                phone: '77777777777',
            }),
        ]);
        expect(listLead).toHaveLength(5);
    });

})