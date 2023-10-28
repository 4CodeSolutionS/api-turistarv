import { DayjsDateProvider } from "@/providers/DateProvider/implementations/provider-dayjs";
import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider";
import { PrismaAnnouncementRepository } from "@/repositories/prisma/prisma-announcement-repository";
import { UpdateAnnouncementUseCase } from "@/usecases/announcements/update-full/update-announcements-usecase";

export async function makeUpdateAnnouncements(): Promise<UpdateAnnouncementUseCase> {
    const annoucementRepository = new PrismaAnnouncementRepository();
    const dayjsDateProvider = new DayjsDateProvider();
    const storageProvider = new FirebaseStorageProvider();
    const updateAnnouncementUseCase = new UpdateAnnouncementUseCase(
        annoucementRepository,
        dayjsDateProvider,
        storageProvider
        )

    return updateAnnouncementUseCase
}