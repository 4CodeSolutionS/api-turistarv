import { FirebaseStorageProvider } from "@/providers/StorageProvider/implementations/firebase-storage.provider";
import { PrismaCampingRepository } from "@/repositories/prisma/prisma-camping-repository";
import { CreateCampingUseCase } from "@/usecases/campings/create/create-campings-usecase";

export async function makeCreateCamping(): Promise<CreateCampingUseCase> {
    const campingRepository = new PrismaCampingRepository()
    const storageProvider = new FirebaseStorageProvider()
    const createCampingUseCase = new CreateCampingUseCase(
        campingRepository,
        storageProvider
    )

    return createCampingUseCase
}