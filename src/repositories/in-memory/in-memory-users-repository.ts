import { Prisma, $Enums, User, Role, Tourist, Vehicle } from "@prisma/client";
import { IUsersRepository } from "../interface-users-repository";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements IUsersRepository{
    
    public users: User[] = []
    
    async create({
        id,
        cpf,
        dateBirth,
        email,
        gender,
        name,
        passport,
        password,
        phone,
        rvLength,
        rvPlate,
        touristType,
        tugPlate,
        vehicleType,
        Acommodation,
        Address,
        Lead,
        Post,
        role,
    }: Prisma.UserUncheckedCreateInput) {
        const user = {
            id: id ? id : randomUUID(),
            dateBirth: new Date(dateBirth),
            email,
            gender,
            name,
            passport: passport ? passport : null,
            password,
            phone,
            rvLength: new Prisma.Decimal(rvLength.toString()),
            rvPlate,
            touristType,
            tugPlate,
            vehicleType,
            Acommodation,
            Address,
            Lead,
            Post,
            role: role ? role : 'GUEST',
            cpf: cpf ? cpf : null,
            createdAt: new Date()
            }
        
        this.users.push(user)

        return user;
    }

    async list() {
        return this.users
    }

    async findById(id: string){
        const user = this.users.find(user => user.id === id)

        if(!user){
            return null
        }

        return user;
    }

    async findByEmail(email: string){
        const user = this.users.find(user => user.email === email)

        if(!user){
            return null
        }

        return user;
    }

    async findByCPF(cpf: string){
        const user = this.users.find(user => user.cpf === cpf)

        if(!user){
            return null
        }

        return user;
    }

    async findByPassport(passport: string){
        const user = this.users.find(user => user.passport === passport)

        if(!user){
            return null
        }

        return user;
    }

    async update({ 
        id,
        cpf,
        dateBirth,
        email,
        gender,
        name,
        passport,
        password,
        phone,
        rvLength,
        rvPlate,
        touristType,
        tugPlate,
        vehicleType,
        role,
    }:Prisma.UserUncheckedUpdateInput){
        const userIndex = this.users.findIndex(user => user.id === id)
        
        this.users[userIndex].cpf = cpf as string | null
        this.users[userIndex].dateBirth = new Date(dateBirth as string)
        this.users[userIndex].email = email as string
        this.users[userIndex].gender = gender as string
        this.users[userIndex].name = name as string
        this.users[userIndex].passport = passport as string | null
        this.users[userIndex].password = password as string
        this.users[userIndex].phone = phone as string
        this.users[userIndex].rvLength = new Prisma.Decimal(rvLength as string)
        this.users[userIndex].rvPlate = rvPlate as string
        this.users[userIndex].touristType = touristType as Tourist
        this.users[userIndex].tugPlate = tugPlate as string
        this.users[userIndex].vehicleType = vehicleType as Vehicle
        this.users[userIndex].role = role as Role

        return this.users[userIndex]
    }

    async delete(id: string){
        const userIndex = this.users.findIndex(user => user.id === id)

        this.users.splice(userIndex, 1)
    }
}