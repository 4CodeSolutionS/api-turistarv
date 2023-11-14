import { Image, Prisma } from "@prisma/client";

export interface IImagesRepository {
    uploadUrl(idCamping:string, url: string):Promise<Image>
    updateUrl(data: Prisma.ImageUncheckedUpdateInput):Promise<void> 
    deleteById(id: string):Promise<void>  
}