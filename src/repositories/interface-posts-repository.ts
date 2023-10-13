import { Post, Prisma } from "@prisma/client"

export interface IPostsRepository {
    create(data:Prisma.PostUncheckedCreateInput):Promise<Post>
    list():Promise<Post[]>
    findById(id:string):Promise<Post | null>
    updateById(data: Prisma.PostUncheckedUpdateInput):Promise<Post>
    deleteById(id:string):Promise<void>
}