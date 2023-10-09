import { ILeadRepository } from "@/repositories/interface-leads-repository";
import { Lead } from "@prisma/client";

export class ListLeadUseCase{
    constructor(
       private leadsRepository: ILeadRepository
    ) {}

    async execute():Promise<Lead[]>{
        //[x] listar leads
        const lead = await this.leadsRepository.list();

        //[x] retornar lead
        return lead;
    }
}