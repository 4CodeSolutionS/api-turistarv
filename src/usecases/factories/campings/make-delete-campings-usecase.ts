import { PrismaCampingRepository } from "@/repositories/prisma/prisma-camping-repository"
import { DeleteCampingUseCase } from "@/usecases/campings/delete/delete-campings-usecase"

export async function makeDeleteCamping(): Promise<DeleteCampingUseCase> {
    const campingRepository = new PrismaCampingRepository()
    const deleteCampingUseCase = new DeleteCampingUseCase(
        campingRepository,
    )

    return deleteCampingUseCase
}