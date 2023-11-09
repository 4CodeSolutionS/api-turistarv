import { Image, Prisma } from "@prisma/client";

export interface IImagesRepository {
    upload(data: Prisma.ImageUncheckedCreateInput):Promise<Image>   
    deleteById(id: string):Promise<void>  
}