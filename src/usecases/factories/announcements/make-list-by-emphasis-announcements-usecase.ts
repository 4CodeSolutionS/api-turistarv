import { PrismaAnnouncementRepository } from "@/repositories/prisma/prisma-announcement-repository";
import { ListAnnouncementByEmphasisUseCase } from "@/usecases/announcements/list-by-emphasis/list-by-emphasis-announcement-usecase";

export async function makeListAnnouncementsByEmphasis(): Promise<ListAnnouncementByEmphasisUseCase> {
    const annoucementRepository = new PrismaAnnouncementRepository();
    const listAnnouncementByEmphasisUseCase = new ListAnnouncementByEmphasisUseCase(
        annoucementRepository
        )

    return listAnnouncementByEmphasisUseCase
}