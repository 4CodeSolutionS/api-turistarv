import { PrismaAnnouncementRepository } from "@/repositories/prisma/prisma-announcement-repository";
import { ListAnnouncementByStatusUseCase } from "@/usecases/announcements/list-by-status/list-by-status-announcement-usecase";

export async function makeListAnnouncementsByStatus(): Promise<ListAnnouncementByStatusUseCase> {
    const annoucementRepository = new PrismaAnnouncementRepository();
    const listAnnouncementByStatusUseCase = new ListAnnouncementByStatusUseCase(
        annoucementRepository
        )

    return listAnnouncementByStatusUseCase
}