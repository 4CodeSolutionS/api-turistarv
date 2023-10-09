import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { UpdateUserUseCase } from "./update-user-usecase";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { CPFAlreadyExistsError } from "@/usecases/errors/cpf-already-exists-error";
import { EmailAlreadyExistsError } from "@/usecases/errors/email-already-exists-error";
import { Prisma } from "@prisma/client";

let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: UpdateUserUseCase;

describe("Update user (unit)", () => {
    beforeEach(async() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        stu = new UpdateUserUseCase(
            usersRepositoryInMemory, 
        )

        await usersRepositoryInMemory.create({
            id: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
            cpf: "524.658.490-93",
            dateBirth: '2023-10-03',
            email: 'email1@test.com',
            name: 'Kaio Moreira',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        })
    });

    test("Should be able to update a user account", async () => {
        const { user } = await stu.execute({ 
            id: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
            dateBirth: new Date('1995-10-03'),
            name: 'Sarah Moreira',
            phone: '77-7777-9999',
        });
        expect(user).toEqual(
            expect.objectContaining({
                id: "bd3234d7-21e6-4e1d-8129-8b823c4d331a",
                dateBirth: new Date('1995-10-03'),
                phone: '77-7777-9999',
                name: 'Sarah Moreira',
            }),
        )
    });

    test("Should not be able to update a user account with id invalid", async () => {
        await expect(()=> stu.execute({ 
            id: 'id-user-3',
            dateBirth: new Date('1995-10-03'),
            name: 'Sarah Moreira',
            phone: '77-7777-9999',
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    });
});