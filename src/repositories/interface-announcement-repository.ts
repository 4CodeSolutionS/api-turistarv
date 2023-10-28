import { Announcement, Prisma, Status } from "@prisma/client"

export interface IAnnouncementRepository {
    create(data:Prisma.AnnouncementUncheckedCreateInput):Promise<Announcement>
    findById(id:string):Promise<Announcement | null>
    findByTitle(title:string):Promise<Announcement | null>
    listByStatus(status: Status):Promise<Announcement[]>
    listByEmphasis(emphasis:boolean):Promise<Announcement[]>
    updateById(data: Prisma.AnnouncementUncheckedUpdateInput):Promise<Announcement>
    deleteById(id:string):Promise<void>
}