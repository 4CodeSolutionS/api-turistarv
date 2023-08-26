import { IUsersRepository } from "@/repositories/interface-users-repository";
import { AccessTimeOutError } from "@/usecases/errors/access-time-out-error";
import 'dotenv/config'
import { ITokensRepository } from "@/repositories/interface-tokens-repository";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestRefreshToken {
    token: string
}

export class RefreshTokenUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private usersTokensRepository: ITokensRepository,
        private dayjsDateProvider: IDateProvider,
    ) {}

    async execute({
        token,
    }:IRequestRefreshToken):Promise<void>{
        // pegar email e id do usuário pelo token através do verify

        // buscar refresh token no banco de dados pelo token e id do usuário

        // verificar se o refresh token existe

        // deletar refresh token do banco de dados

        // criar data de expiração do refresh token
        // gerar um novo refresh token passando email no payload

        // criar novo access token
        
        // salvar refresh token no banco de dados

        // retornar o novo refresh token e o novo access token        
    }
}