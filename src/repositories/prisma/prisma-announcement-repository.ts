import { Prisma, $Enums, Status, Announcement } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { IAnnouncementRepository } from "../interface-announcement-repository";
import { prisma } from "@/lib/prisma";

export class PrismaAnnouncementRepository implements IAnnouncementRepository {
    async findByTitle(title: string){
        const announcement = prisma.announcement.findUnique({where: {title}});

        return announcement;
    }
    async create(data: Prisma.AnnouncementUncheckedCreateInput){
        const announcement = prisma.announcement.create({
                data,
                select:{
                id: true,
                title: true,
                category: true,
                contactInfo: true,
                description: true,
                emphasis: true,
                expirationDate: true,
                image: true,
                linkDetails: true,
                price: true,
                publicationDate: true,
                rate: true,
                views: true,
                status: true,
                address: true
            }
        }) as unknown as Announcement

        return announcement;
    }
    async findById(id: string){
        const announcement = prisma.announcement.findUnique({where: {id}});

        return announcement;
    }
    async listByStatus(status: Status){
        const announcement = prisma.announcement.findMany({
            where: {status},
            select:{
                title: true,
                category: true,
                contactInfo: true,
                description: true,
                emphasis: true,
                expirationDate: true,
                image: true,
                linkDetails: true,
                price: true,
                publicationDate: true,
                rate: true,
                views: true,
                status: true,
                address: true,
            }
        }) as unknown as Announcement[]

        return announcement;
    }
    async listByEmphasis(emphasis: boolean){
        const announcement = prisma.announcement.findMany({
            where: {emphasis},
            select:{
                title: true,
                category: true,
                contactInfo: true,
                description: true,
                emphasis: true,
                expirationDate: true,
                image: true,
                linkDetails: true,
                price: true,
                publicationDate: true,
                rate: true,
                views: true,
                status: true,
                address: true,
            }
        }) as unknown as Announcement[];

        return announcement;
    }
    async updateById(data: Prisma.AnnouncementUncheckedUpdateInput){
        const announcement = prisma.announcement.update({where: {id: data.id as string}, data});

        return announcement;
    }
    async deleteById(id: string){
        const announcement = prisma.announcement.delete({where: {id}});
    }
}