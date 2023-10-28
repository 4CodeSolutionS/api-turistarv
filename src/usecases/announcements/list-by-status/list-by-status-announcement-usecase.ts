import { IAnnouncementRepository } from "@/repositories/interface-announcement-repository";
import { Announcement, Status } from "@prisma/client";

interface  IRequestListAnnouncementByStatus{
   status: Status;
}

export class ListAnnouncementByStatusUseCase{
    constructor(
       private announcementRepository: IAnnouncementRepository,
    ) {}

    async execute({
        status
    }:IRequestListAnnouncementByStatus):Promise<Announcement[]>{
        // retornar lista de anuncios por status
        const announcements = await this.announcementRepository.listByStatus(status);

        return announcements;
    }
}