import { env } from "@/.env";
import { fastifyApp } from "@/app";
import { IUsersRepository } from "@/repositories/interface-users-repository";
import { CredentialsInvalidError } from "@/usecases/errors/credentials-invalid-error";
import { User } from "@prisma/client";
import { compare } from "bcrypt";
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
        // cookie:{
        //     cookieName: 'refreshToken',
        //     signed: false
        // },
        // sign:{
        //    
        // },
        // Criar access token

        const accessToken = fastifyApp.jwt.sign(
            {
                role: findUserExists.role,
            },
            {
                sub: findUserExists.id,
                expiresIn: '10m'
            }
        )
        // Converter Numero de quantidade de dias para Data

        // Criar refresh token
        const refreshToken = fastifyApp.jwt.sign(
            {
                role: findUserExists.role,
            },
            {
                sub: findUserExists.id,
                expiresIn: env.JWT_EXPIRES_IN_REFRESH_TOKEN
            }
        )
        // Salvar refresh token no banco

        // Enviar email de confirmação
        

        return {
            accessToken,
            refreshToken,
            user: findUserExists
        }
    }
}