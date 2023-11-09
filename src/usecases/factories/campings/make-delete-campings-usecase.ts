import { PrismaCampingRepository } from "@/repositories/prisma/prisma-camping-repository"
import { PrismaImageRepository } from "@/repositories/prisma/prisma-campings-repository"
import { DeleteCampingUseCase } from "@/usecases/campings/delete/delete-campings-usecase"

export async function makeDeleteCamping(): Promise<DeleteCampingUseCase> {
    const campingRepository = new PrismaCampingRepository()
    const imageRepository = new PrismaImageRepository()
    const deleteCampingUseCase = new DeleteCampingUseCase(
        campingRepository,
        imageRepository
    )

    return deleteCampingUseCase
}