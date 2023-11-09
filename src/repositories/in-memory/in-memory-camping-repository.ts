import { Camping, Image, Prisma } from "@prisma/client";
import { ICampingsRepository } from "../interface-campings-repository";
import { randomUUID } from "crypto";

export class InMemoryCampingRepository implements ICampingsRepository{
    private campings: Camping[] = []
    
    async findByName(name: string){
        const camping = this.campings.find(camping => camping.name === name)

        if(!camping){
            return null
        }

        return camping
    }

    async create({
        id,
        name,
        propertyRules,
        active,
        images,
    }: Prisma.CampingUncheckedCreateInput){
        const camping = {
            id: id ? id : randomUUID(),
            name,
            propertyRules,
            active,
            images
        }

        this.campings.push(camping)

        return camping
    }
    async list(){
        return this.campings
    }
    async findById(id: string){
        const camping = this.campings.find(camping => camping.id === id)

        if(!camping){
            return null
        }

        return camping
    }
    async updateById({
        id,
        name,
        propertyRules,
        active,
    }: Prisma.CampingUncheckedUpdateInput){
        const campingIndex = this.campings.findIndex(camping => camping.id === id)

        this.campings[campingIndex].name = name as string
        this.campings[campingIndex].propertyRules = propertyRules as string
        this.campings[campingIndex].active = active as boolean

        return this.campings[campingIndex]
    }
    async deleteById(id: string){
       const campingIndex = this.campings.findIndex(camping => camping.id === id)

       this.campings.splice(campingIndex, 1)
    }
}