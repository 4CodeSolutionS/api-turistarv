import { ILeadRepository } from "@/repositories/interface-leads-repository";
import { LeadAlreadyExistsError } from "@/usecases/errors/lead-already-exists-error";
import { Lead } from "@prisma/client";

interface IRequestCreateLead {
   name: string
   email: string
   phone: string
}

export class CreateLeadUseCase{
    constructor(
       private leadsRepository: ILeadRepository
    ) {}

    async execute({
      email,
      name,
      phone,
    }:IRequestCreateLead):Promise<Lead>{
        //[x] buscar lead pelo email
        const findLeadExists = await this.leadsRepository.findByEmail(email);

        //[x] verificar se lead ja existe
        if(findLeadExists){
            throw new LeadAlreadyExistsError();
        }

        //[x] criar lead
        const lead = await this.leadsRepository.create({
            email,
            name,
            phone,
        });

        //[x] retornar lead
        return lead;
    }
}