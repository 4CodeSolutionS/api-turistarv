import { Camping, Image, Prisma } from "@prisma/client";
import { ICampingsRepository } from "../interface-campings-repository";
import { randomUUID } from "crypto";
import { IImagesRepository } from "../interface-images-repository";

export class InMemoryCampingRepository implements ICampingsRepository{
    private campings: Camping[] = []

    constructor(
        private imagesRepository: IImagesRepository
    ){}
    
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
        description,
        images,
    }: Prisma.CampingUncheckedCreateInput){
        const imagesData = images?.createMany?.data as unknown as Image[]

        let imagesUrl = [] as unknown as Image[]

        for(let image of imagesData){
            const idCamping = id as string;
            const imageUpload = await this.imagesRepository.uploadUrl(idCamping, image.url)

            imagesUrl.push(imageUpload)
        }
        const camping = {
            id: id ? id : randomUUID(),
            name,
            propertyRules,
            active,
            description,
            images: imagesUrl
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
        description,
        active,
    }: Prisma.CampingUncheckedUpdateInput){
        const campingIndex = this.campings.findIndex(camping => camping.id === id)

        this.campings[campingIndex].name = name as string
        this.campings[campingIndex].propertyRules = propertyRules as string
        this.campings[campingIndex].active = active as boolean
        this.campings[campingIndex].description = description as string

        return this.campings[campingIndex]
    }
    async deleteById(id: string){
       const campingIndex = this.campings.findIndex(camping => camping.id === id)

       this.campings.splice(campingIndex, 1)
    }
}