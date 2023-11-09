import { Post, Prisma } from "@prisma/client";
import { IPostsRepository } from "../interface-posts-repository";
import { randomUUID } from "crypto";

export class InMemoryPostRepository implements IPostsRepository{
    private posts: Post[] = [];
    async create({
        id, 
        body,
        title,
        image,
    }: Prisma.PostUncheckedCreateInput){
        const posts = {
            id: id ? id : randomUUID(),
            body,
            title,
            image,
            active: true,
            date: new Date(),
        }
        this.posts.push(posts);

        return posts;
    }
    async list(){
        return this.posts;
    }
    async findById(id: string){
        const post = this.posts.find((post) => post.id === id);

        if(!post){
            return null;
        }

        return post;
    }
    async updateById({
        id,
        body,
        title,
        image,
        active,
    }: Prisma.PostUncheckedUpdateInput){
        const postIndex = this.posts.findIndex((post) => post.id === id);

        this.posts[postIndex].body = body as string;
        this.posts[postIndex].title = title as string;
        this.posts[postIndex].image = image as string;
        this.posts[postIndex].active = active as boolean;

        return this.posts[postIndex];
    }
    async deleteById(id: string){
        const postIndex = this.posts.findIndex((post) => post.id === id);

        this.posts.splice(postIndex, 1);
    }
}