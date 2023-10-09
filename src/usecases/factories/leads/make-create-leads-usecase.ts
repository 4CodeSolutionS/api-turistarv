import { PrismaLeadRepository } from "@/repositories/prisma/prisma-leads-repository";
import { CreateLeadUseCase } from "@/usecases/leads/create/create-leads-usecase";

export async function makeCreateLead(): Promise<CreateLeadUseCase> {
    const leadsRepository = new PrismaLeadRepository();
    const createLeadUseCase = new CreateLeadUseCase(leadsRepository)

    return createLeadUseCase
}