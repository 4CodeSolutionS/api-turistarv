import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

async function seedSuper(){
   try {
    const findUserSuper = await prisma.user.findUnique({
        where:{
            id: '7b606dce-5419-4f79-8540-6ed63deea125'
        }
    })

    if(findUserSuper){
        throw new Error('User Super already exists!')
    }

    const admin = await prisma.user.create({
        data:{
            id: '7b606dce-5419-4f79-8540-6ed63deea125',
            name: 'Admin',
            email: 'admin@email.com',
            password: await hash('159753', 8),
            cpf: '123-159-789-88',
            phone: '77-77777-7777',
            role: 'SUPER',
            emailActive: true,
            createdAt: new Date(),
        }
    })

    console.log(admin)
    
    await prisma.$disconnect()
   } catch (error) {
    await prisma.$disconnect()
   }
}
seedSuper()