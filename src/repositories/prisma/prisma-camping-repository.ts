import { Prisma } from "@prisma/client";
import { ICampingsRepository } from "../interface-campings-repository";
import { prisma } from "@/lib/prisma";

export class PrismaCampingRepository implements ICampingsRepository{
    async findByName(name: string){
        const camping = await prisma.camping.findFirst({
            where: {
                name
            }
        })

        return camping
    }
    async create(data: Prisma.CampingUncheckedCreateInput){
        const camping = await prisma.camping.create({
            data,
            select:{
                id:true,
                name:true,
                propertyRules:true,
                active:true,
                description:true,
                areaImage:true,
                images:true,
            }
        })

        return camping
    }
    async list(){
        const campings = await prisma.camping.findMany({
            select:{
                id:true,
                name:true,
                propertyRules:true,
                active:true,
                description:true,
                areaImage:true,
                images:true,
            }
        })

        return campings
    }
    async findById(id: string){
        const camping = await prisma.camping.findUnique({
            where: {
                id
            },
            select:{
                id:true,
                name:true,
                propertyRules:true,
                active:true,
                description:true,
                areaImage:true,
                images:true,
            }   
        })

        return camping
    }
    async updateById(data: Prisma.CampingUncheckedUpdateInput){
        const camping = await prisma.camping.update({
            where: {
                id: data.id as string
            },
            data: data
        })

        return camping
    }
    async deleteById(id: string){
        await prisma.camping.delete({
            where: {
                id
            }
        })
    }
}