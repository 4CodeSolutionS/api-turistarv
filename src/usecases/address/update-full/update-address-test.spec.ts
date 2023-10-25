import { beforeEach, describe, expect, test } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcrypt";
import { InMemoryAddressesRepository } from "@/repositories/in-memory/in-memory-addresses-repository";
import { UpdateAddressByIdUseCase } from "./update-address-usecase";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

let addressRepositoryInMemory: InMemoryAddressesRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let stu: UpdateAddressByIdUseCase;

describe("Update address (unit)", () => {
    beforeEach(async() => {
        addressRepositoryInMemory = new InMemoryAddressesRepository()
        usersRepositoryInMemory = new InMemoryUsersRepository()
        stu = new UpdateAddressByIdUseCase(
            addressRepositoryInMemory, 
            usersRepositoryInMemory
            
        )

        await usersRepositoryInMemory.create({
            id:'2c72f329-8ba9-4335-8491-e8af5e9e19a0',
            cpf: "12345678910",
            dateBirth: new Date('1999-06-01'),
            email: 'user-test@email.com',
            name: 'John Doe',
            phone: '77-77777-7777',
            password: await hash('123456', 8),
        }); 

        await addressRepositoryInMemory.create({
            id: 'c92b51df-a450-43b4-b26a-b96245fc0ada',
            city: 'city-user-1',
            country: 'country-user-1',
            district: 'district-user-1',
            num: 1,
            state: 'state-user-1',
            street: 'street-user-1',
            zipCode: 1,
            complement: 'complement-user-1',
            reference: 'reference-user-1',
            idUser: '2c72f329-8ba9-4335-8491-e8af5e9e19a0'
            
        }); 
    });

    test("Should be able to update a address", async () => {
        const address = await stu.execute({ 
            id: "c92b51df-a450-43b4-b26a-b96245fc0ada",
            idUser: '2c72f329-8ba9-4335-8491-e8af5e9e19a0',
            city: 'city-user-2',
            country: 'country-user-2',
            district: 'district-user-2',
            num: 2,
            state: 'state-user-2',
            street: 'street-user-2',
            zipCode: 2,
            complement: 'complement-user-2',
            reference: 'reference-user-2',
        });
        expect(address).toEqual(
            expect.objectContaining({
                id: "c92b51df-a450-43b4-b26a-b96245fc0ada",
                city: 'city-user-2',
                country: 'country-user-2',
                district: 'district-user-2',
                num: 2,
                state: 'state-user-2',
                street: 'street-user-2',
                zipCode: 2,
                complement: 'complement-user-2',
                reference: 'reference-user-2',
            }),
        )
    });

    test("Should not be able to update a address with id invalid", async () => {
        await expect(()=> stu.execute({ 
            id: "fake-id",
            idUser: '2c72f329-8ba9-4335-8491-e8af5e9e19a0',
            city: 'city-user-2',
            country: 'country-user-2',
            district: 'district-user-2',
            num: 2,
            state: 'state-user-2',
            street: 'street-user-2',
            zipCode: 2,
            complement: 'complement-user-2',
            reference: 'reference-user-2',
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    });

    test("Should not be able to update a address with idUser invalid", async () => {
        await expect(()=> stu.execute({ 
            id: "c92b51df-a450-43b4-b26a-b96245fc0ada",
            idUser: 'fake-id',
            city: 'city-user-2',
            country: 'country-user-2',
            district: 'district-user-2',
            num: 2,
            state: 'state-user-2',
            street: 'street-user-2',
            zipCode: 2,
            complement: 'complement-user-2',
            reference: 'reference-user-2',
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    });
});