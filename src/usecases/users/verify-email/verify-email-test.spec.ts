import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { VerifyEmailUseCase } from "./verify-email-usecase";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { EmailAlreadyExistsError } from "@/usecases/errors/email-already-exists-error";

let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: VerifyEmailUseCase;

describe("Verify email user (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        stu = new VerifyEmailUseCase(usersRepositoryInMemory)

        await usersRepositoryInMemory.create({
            cpf: "12345678910",
            dateBirth: new Date('1999-06-01'),
            email: 'user-test@email.com',
            gender: 'M',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
            rvLength: 10,
            rvPlate: 'ABC-1234',
            touristType: 'ADMIRADOR',
            tugPlate: 'ABC-1234',
            vehicleType: 'CAMPER',
        })
    });

    test("Should be able to verify a new account", async () => {
        await stu.execute({ 
            token: 'xxx',
            email: 'user-test@email.com'
        });

        const user = await usersRepositoryInMemory.findByEmail('user-test@email.com')

        expect(user?.emailActive).toBe(true)
    });

    test("Should be able to verify a new account with Email already exists", async () => {
        const email = 'email@notexists.com'

       await expect(()=> stu.execute({ 
        token: 'xxx',
        email,
    }),
        ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
    });

    // Criar Test para validar token expirado
});