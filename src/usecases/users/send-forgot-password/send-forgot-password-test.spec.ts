import { beforeEach, describe, expect, test, vi } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { InMemoryTokensRepository } from "@/repositories/in-memory/in-memory-tokens-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { SendForgotPasswordUseCase } from "./send-forgot-password-usecase";
import { InMemoryMailProvider } from "@/providers/MailProvider/in-memory/in-memory-mail-provider";

let usersRepositoryInMemory: InMemoryUsersRepository;
let usersTokensRepositoryInMemory: InMemoryTokensRepository;
let dayjsDateProvider: DayjsDateProvider
let sendMailProvider: InMemoryMailProvider
let stu: SendForgotPasswordUseCase;

describe("Send forgot password user (unit)", () => {
    beforeEach(async () => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        usersTokensRepositoryInMemory = new InMemoryTokensRepository()
        dayjsDateProvider = new DayjsDateProvider()
        sendMailProvider = new InMemoryMailProvider()
        stu = new SendForgotPasswordUseCase(
            usersRepositoryInMemory, 
            usersTokensRepositoryInMemory,
            dayjsDateProvider,
            sendMailProvider
        )

        await usersRepositoryInMemory.create({
            id: 'id-user-1',
            cpf: "12345678910",
            dateBirth: new Date('1999-06-01'),
            email: 'user1-test@email.com',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        })
    });

    test("Should be able to send forgot password", async () => {
        await stu.execute({ 
            email: 'user1-test@email.com'
        });

        const userToken = await usersTokensRepositoryInMemory.findByUserId('id-user-1')

        expect(userToken?.token).toEqual(expect.any(String))

        
        // confirmar se email foi enviado
        const message = await sendMailProvider.findMessageSent('user1-test@email.com')

        expect(message).toEqual(
            expect.objectContaining({
                subject: 'Redefinição de Senha',
            })
        )
    });

    test("Should not be able to send forgot password with wrong e-mail", async () => {
        const email = 'email@notexists.com'

       await expect(()=> stu.execute({ 
        email,
    }),
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    });
});