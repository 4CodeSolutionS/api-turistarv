import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { InMemoryTokensRepository } from "@/repositories/in-memory/in-memory-tokens-repository";
import { RegisterUseCase } from "../register/register-usecase";
import { ResetPasswordUseCase } from "./reset-password-usecase";
import { Token, User } from "@prisma/client";
import { InMemoryMailProvider } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";

let usersRepositoryInMemory: InMemoryUsersRepository;
let usersTokensRepositoryInMemory: InMemoryTokensRepository;
let dayjsDateProvider: DayjsDateProvider
let sendMailProvider: InMemoryMailProvider
let registerUseCase: RegisterUseCase;
let stu: ResetPasswordUseCase;

describe("Reset password (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        usersTokensRepositoryInMemory = new InMemoryTokensRepository()
        sendMailProvider = new InMemoryMailProvider()
        dayjsDateProvider = new DayjsDateProvider()
        registerUseCase = new RegisterUseCase(
            usersRepositoryInMemory, 
            dayjsDateProvider,
            usersTokensRepositoryInMemory,
            sendMailProvider
        )
        stu = new ResetPasswordUseCase(
            usersRepositoryInMemory, 
            usersTokensRepositoryInMemory,
            dayjsDateProvider
        )

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

        vi.useFakeTimers()
    });

    afterEach(()=>{
        vi.useFakeTimers()
    })

    test("Should be able to reset passwod account", async () => {
        const {user} = await registerUseCase.execute({
            cpf: "1234567891110",
            dateBirth: new Date('1999-06-01'),
            email: 'user1-test@email.com',
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
        const userToken = await usersTokensRepositoryInMemory.findByUserId(user.id) as Token

        await stu.execute({ 
            token: userToken.token,
            password: '101010'
        });

        const updateUserPassword = await usersRepositoryInMemory.findByEmail(user.email) as User

        expect(updateUserPassword.password !== user.passport).toBeTruthy()
    });

});