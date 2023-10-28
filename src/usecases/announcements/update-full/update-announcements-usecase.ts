import { env } from "@/env";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { IStorageProvider } from "@/providers/StorageProvider/storage-provider.interface";
import { IAnnouncementRepository } from "@/repositories/interface-announcement-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Announcement, Status } from "@prisma/client";

interface  IRequestUpdateAnnouncement{
   id: string;
   title: string;
   description: string;
   expirationDate: Date;
   category: string;
   price: number;
   contactInfo: string;
   status: Status;
   emphasis: boolean;
   image: string;
   linkDetails: string;
}

export class UpdateAnnouncementUseCase{
    constructor(
       private announcementRepository: IAnnouncementRepository,
       private dayjsDateProvider: IDateProvider,
       private storageProvider: IStorageProvider,
    ) {}

    async execute({
      id,
      category,
      contactInfo,
      description,
      emphasis,
      expirationDate,
      image,
      linkDetails,
      price,
      status,
      title,
    }:IRequestUpdateAnnouncement):Promise<Announcement>{
        // buscar anuncio pelo id
        const announcementAlreadyExistsById = await this.announcementRepository.findById(id);

        // validar se o anuncio existe
        if(!announcementAlreadyExistsById){
            throw new AppError('Anúncio não encontrado', 404);
        }

        // validar se expirationDate é maior que a data atual
        const dateNow = this.dayjsDateProvider.dateNow();
        
        const isExpirationDateBeforeDateNow = this.dayjsDateProvider.compareIfBefore(dateNow, expirationDate);
        if(!isExpirationDateBeforeDateNow){
            throw new AppError('Data de expiração inválida', 401)
        }

        // validar se o anuncio já existe com o mesmo titulo
        const announcementAlreadyExistsByTitle = await this.announcementRepository.findByTitle(title);
        
        if(announcementAlreadyExistsByTitle){
            throw new AppError('Anúncio já cadastrado', 409)
        }

        const pathFolder = env.NODE_ENV === "production" ? `${env.FOLDER_TMP_PRODUCTION}/announcements` : `${env.FOLDER_TMP_DEVELOPMENT}/announcements`

        // fazer upload da imagem no firebase storage
        const imageUploaded = await this.storageProvider.uploadFile(image, pathFolder, 'announcements')
       
       
        // criar announcement
        const announcement = await this.announcementRepository.updateById({
            id,
            category,
            contactInfo,
            description,
            emphasis,
            expirationDate,
            image:imageUploaded,
            linkDetails,
            price,
            status,
            title,
        }) as Announcement

        return announcement;
    }
}