import { Prisma } from "@prisma/client";
import { IImagesRepository } from "../interface-images-repository";
import { prisma } from "@/lib/prisma";

export class PrismaImageRepository implements IImagesRepository{
    upload(data: Prisma.ImageUncheckedCreateInput): Promise<{ id: string; idCamping: string; url: string; }> {
        throw new Error("Method not implemented.");
    }
    async deleteById(id: string) {
        await prisma.image.delete({
            where: {
                id
            }
        })
    }

}