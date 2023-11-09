import { IAnnouncementRepository } from "@/repositories/interface-announcement-repository";
import { ICampingsRepository } from "@/repositories/interface-campings-repository";
import { AppError } from "@/usecases/errors/app-error";

interface  IRequestDeleteCampings{
   id: string;
}

export class DeleteCampingUseCase{
    constructor(
        private campingRepository: ICampingsRepository,
    ) {}

    async execute({
     id
    }:IRequestDeleteCampings):Promise<void>{
        // buscar camping pelo id
        const camping = await this.campingRepository.findById(id);

        // validar se camping existe
        if(!camping){
            throw new AppError('Camping não encontrado', 404)
        }

        // deletar camping
        await this.campingRepository.deleteById(id)
       
    }
}