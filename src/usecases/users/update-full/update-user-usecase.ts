import { IUsersRepository } from "@/repositories/interface-users-repository";
import 'dotenv/config'
import { User } from "@prisma/client";
import { AppError } from "@/usecases/errors/app-error";

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
            throw new AppError('Usuário não encontrado', 404)
        }

        
        if(cpf){
            const findUserByCPF = await this.usersRepository.findByCPF(cpf)
        //[x] verificar se cpf ja existe
            if(findUserByCPF){
                throw new AppError('CPF já cadastrado', 409)
            }

        }
        if(passport){
            const findUserByPassport = await this.usersRepository.findByPassport(passport)
            //[x] verificar se passport ja existe
            if(findUserByPassport){
                throw new AppError('Passaporte já cadastrado', 409)
            }
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