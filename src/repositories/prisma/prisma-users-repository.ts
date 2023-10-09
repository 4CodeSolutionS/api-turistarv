import { Prisma, Role, User } from "@prisma/client";
import { IUsersRepository } from "../interface-users-repository";
import { prisma } from "@/lib/prisma";

export class PrismaUsersRepository implements IUsersRepository{
    async findByIdCostumerPayment(id: string){
        const user = await prisma.user.findFirst({
            where:{
                idCustomerAsaas: id
            }
        })
        return user
    }

    async getUserSecurity(id: string){
        const user = await prisma.user.findUnique({
            where:{
                id
            },
            select: {
                id: true,
                name: true,
                cpf: true,
                passport: true,
                email: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                address: true,
                leads: true,
                posts: true,
                role: true,
                createdAt: true,
            }
        }) as unknown as User

        return user
    }

    async changePassword(id: string, password: string){
        const user = await prisma.user.update({
            where: {
                id
            },
            data:{
                password
            }
        })
    }

    async updateIdCostumerPayment(idUser: string, idCustomerPayment: string){
        const user = await prisma.user.update({
            where: {
                id: idUser
            },
            data:{
                idCustomerAsaas: idCustomerPayment
            },
        })

        return user
    }

    async turnAdmin(id: string){
        const user = await prisma.user.update({
            where:{
                id
            },
            data:{
                role: 'ADMIN' as Role
            },
            select: {
                id: true,
                name: true,
                cpf: true,
                passport: true,
                email: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                address: true,
                leads: true,
                posts: true,
                role: true,
                createdAt: true,
            }
        }) as unknown as User


        return user
    }

    async findByCPF(cpf: string){
        const user = await prisma.user.findUnique({
            where: {cpf},
            select: {
                id: true,
                name: true,
                cpf: true,
                passport: true,
                email: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                address: true,
                leads: true,
                posts: true,
                role: true,
                createdAt: true,
            }
        }) as unknown as User

        return user
    }
    
    async findByPassport(passport: string){
        const user = await prisma.user.findUnique({
            where: {passport},
            select: {
                id: true,
                name: true,
                cpf: true,
                passport: true,
                email: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                address: true,
                leads: true,
                posts: true,
                role: true,
                createdAt: true,
            }
        }) as unknown as User

        return user
    }

    async create(data: Prisma.UserUncheckedCreateInput){
        const user = await prisma.user.create(
            {
                data,
                select: {
                    id: true,
                    name: true,
                    cpf: true,
                    passport: true,
                    email: true,
                    emailActive: true,
                    dateBirth: true,
                    phone: true,
                    address: true,
                    leads: true,
                    posts: true,
                    role: true,
                    createdAt: true,
                }
            }) as unknown as User
        
        return user
    }

    async list(){
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                cpf: true,
                passport: true,
                email: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                address: true,
                leads: true,
                posts: true,
                role: true,
                createdAt: true,
            }
        }) as unknown as User[]

        return users
    }

    async findById(id: string){
        const user = await prisma.user.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                cpf: true,
                passport: true,
                password: true,
                email: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                address: true,
                leads: true,
                posts: true,
                role: true,
                createdAt: true,
            }
        }) as unknown as User

        return user
    }

    async findByEmail(email: string){
        const user = await prisma.user.findUnique({
            where: {email},
            select: {
                id: true,
                name: true,
                cpf: true,
                passport: true,
                password: true,
                email: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                address: true,
                leads: true,
                posts: true,
                role: true,
                createdAt: true,
            }
        }) as unknown as User

        return user
    }

    async activeEmail(id: string){
        await prisma.user.update({
            where: {
                id
            },
            data:{
                emailActive: true
            }
        })
    }

    async update(data: Prisma.UserUncheckedUpdateInput){
        const user = await prisma.user.update({
            where: {
                id: data.id as string
            },
            select: {
                id: true,
                name: true,
                cpf: true,
                passport: true,
                email: true,
                emailActive: true,
                dateBirth: true,
                phone: true,
                address: true,
                leads: true,
                posts: true,
                role: true,
                createdAt: true,
            },
            data
        }) as unknown as User

        return user
    }

    async delete(id: string){
        await prisma.user.delete({
            where: {
                id
            }
        })
    }
}