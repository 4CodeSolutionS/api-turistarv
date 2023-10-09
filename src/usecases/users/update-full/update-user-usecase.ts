import { IUsersRepository } from "@/repositories/interface-users-repository";
import 'dotenv/config'
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { User } from "@prisma/client";

interface IRequestUpdateUser {
    id: string,
    name: string,
    phone: string,
    dateBirth: Date,
    cpf?: string,
    passport?: string,
}
interface IResponseUpdateUser {
    user: User
}

export class UpdateUserUseCase{
    constructor(
        private usersRepository: IUsersRepository,
    ) {}

    async execute({
        id,
        name,
        phone,
        dateBirth,
        cpf,
        passport
    }:IRequestUpdateUser):Promise<IResponseUpdateUser>{
        const findUserExists = await this.usersRepository.getUserSecurity(id)

        if(!findUserExists){
            throw new ResourceNotFoundError()
        }

       const userUpdated = await this.usersRepository.update({
            id,
            name,
            phone,
            dateBirth,
            cpf,
            passport
        })
        
        return {
            user: userUpdated
        }
    }
}