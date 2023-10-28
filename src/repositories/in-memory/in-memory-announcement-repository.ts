import { Prisma, Announcement, Status, Address } from "@prisma/client";
import { IAnnouncementRepository } from "../interface-announcement-repository";
import { randomUUID } from "crypto";
import { InMemoryAddressesRepository } from "./in-memory-addresses-repository";

export class InMemoryAnnouncementRepository implements IAnnouncementRepository {
    private announcements: Announcement[] = [];

    constructor(
        private addressRepository: InMemoryAddressesRepository
    ){}
    
    async findByTitle(title: string){
        const announcement = this.announcements.find(announcement => announcement.title === title)

        if(!announcement){
            return null
        }

        return announcement;
    }

    async create({
        id,
        category,
        contactInfo,
        description,
        emphasis,
        expirationDate,
        image,
        linkDetails,
        price,
        publicationDate,
        rate,
        status,
        title,
        views,
        address,
    }: Prisma.AnnouncementUncheckedCreateInput){
        const {create} = address as any
        const formatAddres = create as Address

        const createAddress = await this.addressRepository.create({
            idAnnouncement: id,
            city: formatAddres.city,
            complement: formatAddres.complement,
            district: formatAddres.district,
            num: formatAddres.num,
            state: formatAddres.state,
            street: formatAddres.street,
            country: formatAddres.country,
            zipCode: formatAddres.zipCode,
        })

        const announcement = {
            id: id ? id : randomUUID(),
            category,
            contactInfo,
            description,
            emphasis: emphasis ? emphasis : false,
            expirationDate: new Date(expirationDate),
            image,
            linkDetails,
            price: new Prisma.Decimal(price as number),
            publicationDate: new Date(publicationDate as string),
            rate: rate ? rate : 0,
            status: status ? status : 'ACTIVE',
            title,
            views: views ? views : 0,
            address: [createAddress],
        }
        this.announcements.push(announcement);

        return announcement;
    }
  
    async findById(id: string){
        const announcement = this.announcements.find(announcement => announcement.id === id)

        if(!announcement){
            return null
        }

        return announcement;
    }
    async listByStatus(status: string){
        const announcement = this.announcements.filter(announcement => announcement.status === status)

        return announcement;
    }
    async listByEmphasis(emphasis: boolean){
        const announcement = this.announcements.filter(announcement => announcement.emphasis === emphasis)

        return announcement;
    }
    async updateById({
        id,
        category,
        contactInfo,
        description,
        emphasis,
        image,
        linkDetails,
        price,
        status,
        title,
    }: Prisma.AnnouncementUncheckedUpdateInput){
        const announcementIndex = this.announcements.findIndex(announcement => announcement.id === id)

        this.announcements[announcementIndex].category = category as string;
        this.announcements[announcementIndex].contactInfo = contactInfo as string;
        this.announcements[announcementIndex].description = description as string;
        this.announcements[announcementIndex].emphasis = emphasis as boolean;
        this.announcements[announcementIndex].image = image as string;
        this.announcements[announcementIndex].linkDetails = linkDetails as string;
        this.announcements[announcementIndex].price = new Prisma.Decimal(price as number);
        this.announcements[announcementIndex].status = status as Status;
        this.announcements[announcementIndex].title = title as string;

        return this.announcements[announcementIndex];

    }
    async deleteById(id: string){
        const announcementIndex = this.announcements.findIndex(announcement => announcement.id === id)

        this.announcements.splice(announcementIndex, 1);
    }
  
}