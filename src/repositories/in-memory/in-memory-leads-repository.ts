import { Lead, Prisma } from "@prisma/client";
import { ILeadRepository } from "../interface-leads-repository";
import { randomUUID } from "node:crypto";

export class InMemoryLeadsRepository implements ILeadRepository{
    private leads: Lead[] = [];

    async create({
        email,
        name,
        phone,
    }: Prisma.LeadUncheckedCreateInput){
        const lead = {
            id: randomUUID(),
            email,
            name,
            phone,
            active: true,
            createdAt: new Date(),
        }

        this.leads.push(lead);

        return lead;


    }

    async list(){
        return this.leads;
    }
    
    async findByEmail(email: string){
        const lead = this.leads.find((lead) => lead.email === email);

        if(!lead){
            return null
        }

        return lead;
    }
}