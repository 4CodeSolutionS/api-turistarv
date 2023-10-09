import { Lead, Prisma } from "@prisma/client"

export interface ILeadRepository {
    create(data:Prisma.LeadUncheckedCreateInput):Promise<Lead>
    list():Promise<Lead[]>
    findByEmail(email:string):Promise<Lead | null>
}