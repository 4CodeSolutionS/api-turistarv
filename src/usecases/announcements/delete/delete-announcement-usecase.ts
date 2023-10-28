import { IAnnouncementRepository } from "@/repositories/interface-announcement-repository";
import { AppError } from "@/usecases/errors/app-error";

interface  IRequestDeleteAnnouncement{
   id: string;
}

export class DeleteAnnouncementUseCase{
    constructor(
       private announcementRepository: IAnnouncementRepository,
    ) {}

    async execute({
     id
    }:IRequestDeleteAnnouncement):Promise<void>{
        // buscar announcement pelo id
        const announcement = await this.announcementRepository.findById(id);

        // validar se o anuncio existe
        if(!announcement){
            throw new AppError('Anúncio não encontrado', 404);
        }

        // deletar announcement
        await this.announcementRepository.deleteById(id);
    }
}