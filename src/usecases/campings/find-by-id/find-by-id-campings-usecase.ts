import { ICampingsRepository } from "@/repositories/interface-campings-repository";
import { IImagesRepository } from "@/repositories/interface-images-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Camping, Image } from "@prisma/client";

export interface ICamping{
    caping: Camping;
    images: Image[];
}

interface  IRequestFindCampings{
   id: string;
}

export class FindCampingUseCase{
    constructor(
        private campingRepository: ICampingsRepository,
    ) {}

    async execute({
     id
    }:IRequestFindCampings):Promise<ICamping>{
        // buscar camping pelo id
        const camping = await this.campingRepository.findById(id) as unknown as ICamping
        // validar se camping existe
        if(!camping){
            throw new AppError('Camping não encontrado', 404)
        }
       return camping;
    }
}