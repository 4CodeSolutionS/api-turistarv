import { Prisma, $Enums, User, Role, Tourist, Vehicle } from "@prisma/client";
import { IUsersRepository } from "../interface-users-repository";
import { randomUUID } from "crypto";

export class InMemoryUsersRepository implements IUsersRepository{
    public users: User[] = []
    
    async findByIdCostumerPayment(id: string){
        const user = this.users.find(user => user.idCustomerAsaas === id)

        if(!user){
            return null
        }   

        return user
    }

    async getUserSecurity(id: string){
        const user = this.users.find(user => user.id === id)

    if(!user){
        return null
    }
    const userSecurity:User = {
        id: user.id,
        idCustomerAsaas: user.idCustomerAsaas,
        email: user.email,
        cpf: user.cpf,
        passport: user.passport,
        name: user.name,
        phone: user.phone,
        gender: user.gender,
        role: user.role,
        dateBirth: user.dateBirth,
        rvLength: user.rvLength,
        tugPlate: user.tugPlate,
        rvPlate: user.rvPlate,
        touristType: user.touristType,
        vehicleType: user.vehicleType,
        emailActive: user.emailActive,
        createdAt: user.createdAt,
    } as User

    return userSecurity;
    }
  
    async changePassword(id: string, password: string){
        const userIndex = this.users.findIndex(user => user.id === id)

        if(userIndex === -1){
            return null
        }

        this.users[userIndex].password = password
    }

    async updateIdCostumerPayment(idUser: string, idCustomerPayment: string){
        const userIndex = this.users.findIndex(user => user.id === idUser)

        this.users[userIndex].idCustomerAsaas = idCustomerPayment as string

        return this.users[userIndex]
    }

    async turnAdmin(id: string){
        const userIndex = this.users.findIndex(user => user.id === id)

        this.users[userIndex].role = 'ADMIN'

        return this.users[userIndex]
    }    
    
    async create({
        id,
        idCustomerAsaas,
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
        emailActive,
        role,
        acommodations,
        address,
        leads,
        posts,
        tokens,
    }: Prisma.UserUncheckedCreateInput) {
        const user = {
            id: id ? id : randomUUID(),
            idCustomerAsaas: idCustomerAsaas ? idCustomerAsaas : null,
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
            acommodations,
            address: [],
            leads: [],
            posts: [],
            tokens: [],
            emailActive: emailActive ? emailActive : false,
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

    async activeEmail(id:string, activate = true) {
        const userIndex = this.users.findIndex(user => user.id === id)

        if(userIndex === -1){
            return null
        }

        this.users[userIndex].emailActive = activate
    }

    async update({ 
        id,
        dateBirth,
        email,
        gender,
        name,
        passport,
        phone,
        rvLength,
        rvPlate,
        touristType,
        tugPlate,
        vehicleType,
    }:Prisma.UserUncheckedUpdateInput){
        const userIndex = this.users.findIndex(user => user.id === id)
        
        this.users[userIndex].dateBirth = new Date(dateBirth as string)
        this.users[userIndex].email = email as string
        this.users[userIndex].gender = gender as string
        this.users[userIndex].name = name as string
        this.users[userIndex].passport = passport as string | null
        this.users[userIndex].phone = phone as string
        this.users[userIndex].rvLength = new Prisma.Decimal(rvLength as string)
        this.users[userIndex].rvPlate = rvPlate as string
        this.users[userIndex].touristType = touristType as Tourist
        this.users[userIndex].tugPlate = tugPlate as string
        this.users[userIndex].vehicleType = vehicleType as Vehicle

        return this.users[userIndex]
    }

    async delete(id: string){
        const userIndex = this.users.findIndex(user => user.id === id)

        this.users.splice(userIndex, 1)
    }
}