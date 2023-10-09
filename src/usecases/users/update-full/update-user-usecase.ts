import { IUsersRepository } from "@/repositories/interface-users-repository";
import 'dotenv/config'
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { User } from "@prisma/client";
import { CPFAlreadyExistsError } from "@/usecases/errors/cpf-already-exists-error";
import { PassportAlreadyExistsError } from "@/usecases/errors/passport-already-exist-error";

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

        
        if(cpf){
            const findUserByCPF = await this.usersRepository.findByCPF(cpf)
        //[x] verificar se cpf ja existe
            if(findUserByCPF){
                throw new CPFAlreadyExistsError()
            }

        }
        if(passport){
            const findUserByPassport = await this.usersRepository.findByPassport(passport)
            //[x] verificar se passport ja existe
            if(findUserByPassport){
                throw new PassportAlreadyExistsError()
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