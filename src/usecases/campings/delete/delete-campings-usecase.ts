import { IAnnouncementRepository } from "@/repositories/interface-announcement-repository";
import { ICampingsRepository } from "@/repositories/interface-campings-repository";
import { IImagesRepository } from "@/repositories/interface-images-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Camping, Image } from "@prisma/client";

export interface ICamping{
    caping: Camping;
    images: Image[];
}

interface  IRequestDeleteCampings{
   id: string;
}

export class DeleteCampingUseCase{
    constructor(
        private campingRepository: ICampingsRepository,
        private imageRepository: IImagesRepository
    ) {}

    async execute({
     id
    }:IRequestDeleteCampings):Promise<void>{
        // buscar camping pelo id
        const camping = await this.campingRepository.findById(id) as unknown as ICamping
        console.log(camping)
        // validar se camping existe
        if(!camping){
            throw new AppError('Camping não encontrado', 404)
        }

        // criar for para percorrer as imagens do camping
        for(let campingValue of camping.images){
            // deletar imagens do camping
            await this.imageRepository.deleteById(campingValue.id)
        }

        // deletar camping
        await this.campingRepository.deleteById(id)
       
    }
}