import { IUsersRepository } from "@/repositories/interface-users-repository";
import { AccessTimeOutError } from "@/usecases/errors/access-time-out-error";
import 'dotenv/config'
import { ITokensRepository } from "@/repositories/interface-tokens-repository";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestVerifyEmail {
    token: string
    email: string
}

export class VerifyEmailUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private usersTokensRepository: ITokensRepository,
        private dayjsDateProvider: IDateProvider,
    ) {}

    async execute({
        token,
        email
    }:IRequestVerifyEmail):Promise<void>{
        const findUserByEmail = await this.usersRepository.findByEmail(email)

        if(!findUserByEmail){
            throw new ResourceNotFoundError()
        }

        //[x] verificar se o email ja foi ativado
        if(findUserByEmail.emailActive){
            throw new AccessTimeOutError()
        }

        const findToken = await this.usersTokensRepository.findByToken(token)

        if(!findToken){
            throw new ResourceNotFoundError()
        }

        // verificar se o token está expirado
        if  (
                this.dayjsDateProvider.compareIfBefore
                (
                    findToken.expireDate, 
                    this.dayjsDateProvider.dateNow()
                )
            )
            {
                throw new AccessTimeOutError()
            }


        //atualizar emailActive para true
        await this.usersRepository.activeEmail(findUserByEmail.id)
    }
}