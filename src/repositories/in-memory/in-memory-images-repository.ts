import { Image, Prisma } from "@prisma/client";
import { IImagesRepository } from "../interface-images-repository";
import { randomUUID } from "crypto";

export class InMemoryImagesRepository implements IImagesRepository{
    private images: Image[] = []
    
    async uploadUrl(idCamping: string, url: string) {
        const image = {
            id: randomUUID(),
            idCamping,
            url: url as string
        }

        this.images.push(image)

        return image
    }

    async updateUrl({
        id,
        url
    }: Prisma.ImageUncheckedUpdateInput){
        
        const imageIndex = this.images.findIndex(image => image.id === id)

        this.images[imageIndex].url = url as string
    }

    async deleteById(id: string) {
        const imageIndex = this.images.findIndex(image => image.id === id)

        this.images.splice(imageIndex, 1)
    }
}