import { PrismaCampingRepository } from "@/repositories/prisma/prisma-camping-repository";
import { ListCampingUseCase } from "@/usecases/campings/list/list-campings-usecase";

export async function makeListCamping(): Promise<ListCampingUseCase> {
    const campingRepository = new PrismaCampingRepository()
    const listCampingUseCase = new ListCampingUseCase(
        campingRepository,
    )

    return listCampingUseCase
}