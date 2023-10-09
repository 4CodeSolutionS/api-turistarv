import { Prisma } from "@prisma/client";
import { ILeadRepository } from "../interface-leads-repository";
import { prisma } from "@/lib/prisma";

export class PrismaLeadRepository implements ILeadRepository{
    async create(data: Prisma.LeadUncheckedCreateInput){
        const lead = await prisma.lead.create({data})

        return lead;
    }
    async list(){
        return await prisma.lead.findMany();
    }
    
    async findByEmail(email: string){
        const lead = await prisma.lead.findUnique({
            where: {
                email
            }
        })

        return lead;
    }
}