import { Prisma } from "@prisma/client";
import { IImagesRepository } from "../interface-images-repository";
import { prisma } from "@/lib/prisma";

export class PrismaImageRepository implements IImagesRepository{
    uploadUrl(idCamping: string, url: string): Promise<{ id: string; idCamping: string; url: string; }> {
        throw new Error("Method not implemented.");
    }
    
    async updateUrl(data: Prisma.ImageUncheckedUpdateInput){
        await prisma.image.update({
            where: {
                id: data.id as string
            },
            data: {
                url: data.url as string
            }
        })
    }
    
    async deleteById(id: string) {
        await prisma.image.delete({
            where: {
                id
            }
        })
    }

}