import { IUsersRepository } from "@/repositories/interface-users-repository";
import { CredentialsInvalidError } from "@/usecases/errors/credentials-invalid-error";
import { User } from "@prisma/client";
import { compare } from "bcrypt";
import { randomUUID } from "crypto";
import 'dotenv/config'

interface IRequestLoginAccount {
    email: string,
    password: string,
}
interface IResponseLoginAccount {
    accessToken: string
    refreshToken: string
    user: User
}

export class LoginUseCase{
    constructor(
        private usersRepository: IUsersRepository,
    ) {}

    async execute({
        email,
        password
    }:IRequestLoginAccount):Promise<IResponseLoginAccount>{
        const findUserExists = await this.usersRepository.findByEmail(email)

        if(!findUserExists){
            throw new CredentialsInvalidError()
        }

        // comparar senha
        const passwordMatch = await compare(password, findUserExists.password)

        if(!passwordMatch){
            throw new CredentialsInvalidError()
        }
       
        // Criar access token
       
        // Criar refresh token
        
        // Salvar refresh token no banco

        return {
            accessToken: randomUUID(),
            refreshToken: randomUUID(),
            user: findUserExists
        }
    }
}