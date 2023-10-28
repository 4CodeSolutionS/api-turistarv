import { PrismaLeadRepository } from "@/repositories/prisma/prisma-leads-repository";
import { ListLeadUseCase } from "@/usecases/leads/list/list-leads-usecase";

export async function makeListLead(): Promise<ListLeadUseCase> {
    const leadsRepository = new PrismaLeadRepository();
    const listLeadUseCase = new ListLeadUseCase(leadsRepository)

    return listLeadUseCase
}