import { IAnnouncementRepository } from "@/repositories/interface-announcement-repository";
import { Announcement } from "@prisma/client";

interface  IRequestListAnnouncementByEmphasis{
   emphasis: boolean;
}

export class ListAnnouncementByEmphasisUseCase{
    constructor(
       private announcementRepository: IAnnouncementRepository,
    ) {}

    async execute({
        emphasis
    }:IRequestListAnnouncementByEmphasis):Promise<Announcement[]>{
        // retornar lista de anuncios por destaque
        const announcements = await this.announcementRepository.listByEmphasis(emphasis);

        return announcements;
    }
}