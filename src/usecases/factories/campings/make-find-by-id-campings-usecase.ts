import { PrismaCampingRepository } from "@/repositories/prisma/prisma-camping-repository"
import { PrismaImageRepository } from "@/repositories/prisma/prisma-images-repository"
import { FindCampingUseCase } from "@/usecases/campings/find-by-id/find-by-id-campings-usecase"

export async function makeFindCampingById(): Promise<FindCampingUseCase> {
    const campingRepository = new PrismaCampingRepository()
    const findCampingUseCase = new FindCampingUseCase(
        campingRepository,
    )

    return findCampingUseCase
}