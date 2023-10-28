import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider";
import { PrismaAnnouncementRepository } from "@/repositories/prisma/prisma-announcement-repository";
import { CreateAnnouncementUseCase } from "@/usecases/announcements/create/create-announcements-usecase";

export async function makeCreateAnnouncements(): Promise<CreateAnnouncementUseCase> {
    const annoucementRepository = new PrismaAnnouncementRepository();
    const dayjsDateProvider = new DayjsDateProvider();
    const storageProvider = new FirebaseStorageProvider();
    const createAnnouncementUseCase = new CreateAnnouncementUseCase(
        annoucementRepository,
        dayjsDateProvider,
        storageProvider
        )

    return createAnnouncementUseCase
}