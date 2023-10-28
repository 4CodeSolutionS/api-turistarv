import { env } from "@/env";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { IStorageProvider } from "@/providers/StorageProvider/storage-provider.interface";
import { IAnnouncementRepository } from "@/repositories/interface-announcement-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Address, Announcement, Status } from "@prisma/client";

interface  IRequestCreateAnnouncement{
   title: string;
   description: string;
   expirationDate: Date;
   category: string;
   price: number;
   address: Address;
   contactInfo: string;
   status: Status;
   emphasis: boolean;
   image: string;
   linkDetails: string;
}

export class CreateAnnouncementUseCase{
    constructor(
       private announcementRepository: IAnnouncementRepository,
       private dayjsDateProvider: IDateProvider,
       private storageProvider: IStorageProvider,
    ) {}

    async execute({
      address,
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
    }:IRequestCreateAnnouncement):Promise<Announcement>{
        // validar se expirationDate é maior que a data atual
        const dateNow = this.dayjsDateProvider.dateNow();
        const isExpirationDateBeforeDateNow = this.dayjsDateProvider.compareIfBefore(dateNow, expirationDate);
        if(!isExpirationDateBeforeDateNow){
            throw new AppError('Data de expiração inválida', 400)
        }

        // validar se o anuncio já existe com o mesmo titulo
        const announcementAlreadyExists = await this.announcementRepository.findByTitle(title);
        
        if(announcementAlreadyExists){
            throw new AppError('Anúncio já cadastrado', 409)
        }

        const pathFolder = env.NODE_ENV === "production" ? `${env.FOLDER_TMP_PRODUCTION}/announcements` : `${env.FOLDER_TMP_DEVELOPMENT}/announcements`

        // fazer upload da imagem no firebase storage
        const imageUploaded = await this.storageProvider.uploadFile(image, pathFolder, 'announcements')
       
        // criar announcement
        const announcement = await this.announcementRepository.create({
            category,
            contactInfo,
            description,
            emphasis,
            expirationDate,
            image: imageUploaded as string,
            linkDetails,
            price,
            status,
            title,
            address:{
                create:{
                    city: address.city,
                    num: address.num,
                    state: address.state,
                    street: address.street,
                    zipCode: address.zipCode,
                    country: address.country,
                    district: address.district,
                    complement: address.complement,
                    reference: address.reference,
                }
            }
        })

        return announcement;
    }
}