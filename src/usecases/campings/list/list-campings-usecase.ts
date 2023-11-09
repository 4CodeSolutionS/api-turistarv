import { ICampingsRepository } from "@/repositories/interface-campings-repository"
import { Camping } from "@prisma/client"

export class ListCampingUseCase {
    constructor(
        private campingRepository: ICampingsRepository,
        ) {}

    async execute(): Promise<Camping[]>{
       const campings = await this.campingRepository.list()

       return campings
    }
}