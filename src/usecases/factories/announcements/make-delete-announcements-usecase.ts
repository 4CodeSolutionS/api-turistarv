import { PrismaAnnouncementRepository } from "@/repositories/prisma/prisma-announcement-repository";
import { DeleteAnnouncementUseCase } from "@/usecases/announcements/delete/delete-announcement-usecase";

export async function makeDeleteAnnouncements(): Promise<DeleteAnnouncementUseCase> {
    const annoucementRepository = new PrismaAnnouncementRepository();
    const deleteAnnouncementUseCase = new DeleteAnnouncementUseCase(
        annoucementRepository
        )

    return deleteAnnouncementUseCase
}