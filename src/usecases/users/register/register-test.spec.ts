import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { EmailAlreadyExistsError } from "@/usecases/errors/email-already-exists-error";
import { PassportAlreadyExistsError } from "@/usecases/errors/passport-already-exists-error";
import { RegisterUseCase } from "./register-usecase";
import { CPFAlreadyExistsError } from "@/usecases/errors/cpf-already-exists-error";

let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: RegisterUseCase;

describe("Register user (unit)", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        stu = new RegisterUseCase(usersRepositoryInMemory)
    });

    test("Should be able to register a new account", async () => {
        const { user } = await stu.execute({ 
            cpf: "12345678910",
            dateBirth: new Date('1999-06-01'),
            email: 'email@test.com',
            gender: 'M',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: '123456',
            rvLength: 10,
            rvPlate: 'ABC-1234',
            touristType: 'ADMIRADOR',
            tugPlate: 'ABC-1234',
            vehicleType: 'CAMPER',
        });
        expect(user.id).toEqual(expect.any(String))
    });

    test("Should not be able to register a new account with Email already exists", async () => {
        const email = 'email@test.com'

        await stu.execute({ 
            cpf: "12345678910",
            dateBirth: new Date('1999-06-01'),
            email,
            gender: 'M',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: '123456',
            rvLength: 10,
            rvPlate: 'ABC-1234',
            touristType: 'ADMIRADOR',
            tugPlate: 'ABC-1234',
            vehicleType: 'CAMPER',
        });

       await expect(()=> stu.execute({
            cpf: "125678910",
            dateBirth: new Date('1999-06-01'),
            email,
            gender: 'M',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: '123456',
            rvLength: 10,
            rvPlate: 'ABC-1234',
            touristType: 'ADMIRADOR',
            tugPlate: 'ABC-1234',
            vehicleType: 'CAMPER',
        }),
        ).rejects.toBeInstanceOf(EmailAlreadyExistsError)
    });

    test("Should not be able to register a new account with CPF already exists", async () => {
        const cpf = "12345678910"

        await stu.execute({ 
            cpf,
            dateBirth: new Date('1999-06-01'),
            email: 'email1@test.com',
            gender: 'M',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: '123456',
            rvLength: 10,
            rvPlate: 'ABC-1234',
            touristType: 'ADMIRADOR',
            tugPlate: 'ABC-1234',
            vehicleType: 'CAMPER',
        });

       await expect(()=> stu.execute({
            cpf,
            dateBirth: new Date('1999-06-01'),
            email: 'email2@test.com',
            gender: 'M',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: '123456',
            rvLength: 10,
            rvPlate: 'ABC-1234',
            touristType: 'ADMIRADOR',
            tugPlate: 'ABC-1234',
            vehicleType: 'CAMPER',
        }),
        ).rejects.toBeInstanceOf(CPFAlreadyExistsError)
    });

    test("Should not be able to register a new account with Passport already exists", async () => {
        const passport = "123456789101212"

        const x = await stu.execute({ 
            passport,
            dateBirth: new Date('1999-06-01'),
            email: 'email1@test.com',
            gender: 'M',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: '1234567',
            rvLength: 10,
            rvPlate: 'ABC-1234',
            touristType: 'ADMIRADOR',
            tugPlate: 'ABC-1234',
            vehicleType: 'CAMPER',
        });

       await expect(()=> stu.execute({
            passport,
            dateBirth: new Date('1999-06-01'),
            email: 'email2@test.com',
            gender: 'M',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: '1234567',
            rvLength: 10,
            rvPlate: 'ABC-1234',
            touristType: 'ADMIRADOR',
            tugPlate: 'ABC-1234',
            vehicleType: 'CAMPER',
        }),
        ).rejects.toBeInstanceOf(PassportAlreadyExistsError)
    });
});