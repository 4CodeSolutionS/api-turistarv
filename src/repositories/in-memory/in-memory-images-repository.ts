import { Image, Prisma } from "@prisma/client";
import { IImagesRepository } from "../interface-images-repository";

export class InMemoryImagesRepository implements IImagesRepository{
    private images: Image[] = []
    upload(data: Prisma.ImageUncheckedCreateInput): Promise<{ id: string; idCamping: string; url: string; }> {
        throw new Error("Method not implemented.");
    }
    async deleteById(id: string) {
        const imageIndex = this.images.findIndex(image => image.id === id)

        this.images.splice(imageIndex, 1)
    }
}