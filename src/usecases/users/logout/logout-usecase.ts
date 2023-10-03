import 'dotenv/config'
import { ITokensRepository } from "@/repositories/interface-tokens-repository";
import { sign, verify } from "jsonwebtoken";
import { env } from "@/env";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestLogout {
    refreshToken: string
    idUser: string
}

export class LogoutUseCase{
    constructor(
        private usersTokensRepository: ITokensRepository,
    ) {}

    async execute({
        refreshToken,
        idUser
    }:IRequestLogout):Promise<void>{
        const userToken = await this.usersTokensRepository.findByUserAndToken(idUser, refreshToken)

        if(!userToken){
            throw new ResourceNotFoundError()
        }

        // deletar refresh token do banco de dados
        await this.usersTokensRepository.delete(userToken.id)

        
    }
}