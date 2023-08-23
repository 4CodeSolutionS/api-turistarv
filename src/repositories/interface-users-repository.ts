import { Prisma, User } from "@prisma/client"

export interface IUsersRepository {
    create(data:Prisma.UserUncheckedCreateInput): Promise<User>
    list(): Promise<User[]>
    findById(id:string): Promise<User | null>
    findByEmail(email:string): Promise<User | null>
    findByCPF(cpf:string): Promise<User | null>
    findByPassport(passport:string): Promise<User | null>
    update(data:Prisma.UserUncheckedUpdateInput): Promise<User>
    delete(id:string): Promise<void>
}