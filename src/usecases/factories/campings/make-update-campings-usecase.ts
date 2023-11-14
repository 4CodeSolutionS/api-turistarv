import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider";
import { PrismaCampingRepository } from "@/repositories/prisma/prisma-camping-repository";
import { PrismaImageRepository } from "@/repositories/prisma/prisma-images-repository";
import { UpdateCampingUseCase } from "@/usecases/campings/update-full/update-campings-usecase";

export async function makeUpdateCamping(): Promise<UpdateCampingUseCase> {
    const campingRepository = new PrismaCampingRepository()
    const storageProvider = new FirebaseStorageProvider()
    const imageRepository = new PrismaImageRepository()
    const updateCampingUseCase = new UpdateCampingUseCase(
        campingRepository,
        storageProvider,
        imageRepository
    )

    return updateCampingUseCase
}