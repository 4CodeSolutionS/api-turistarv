import { Prisma } from "@prisma/client";
import { IPostsRepository } from "../interface-posts-repository";
import { prisma } from "@/lib/prisma";

export class PrismaPostsRepository implements IPostsRepository{
    async create(data: Prisma.PostUncheckedCreateInput){
        const post = await prisma.post.create({data})

        return post;
    }
    async list(){
        return prisma.post.findMany();
    }
    async findById(id: string){
        const post = await prisma.post.findUnique({
            where: {
                id
            }
        })

        return post;
    }
    async updateById(data: Prisma.PostUncheckedUpdateInput){
        const post = await prisma.post.update({
            where: {
                id: data.id as string
            },
            data
        })

        return post;
    }
    async deleteById(id: string): Promise<void> {
        await prisma.post.delete({
            where: {
                id
            }
        })
    }
}