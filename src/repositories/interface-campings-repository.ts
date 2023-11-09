import { Camping, Prisma } from "@prisma/client"

export interface ICampingsRepository {
    create(data:Prisma.CampingUncheckedCreateInput):Promise<Camping>
    list():Promise<Camping[]> 
    findById(id:string):Promise<Camping | null>
    findByName(name:string):Promise<Camping | null>
    updateById(data: Prisma.CampingUncheckedUpdateInput):Promise<Camping>
    deleteById(id:string):Promise<void>
}