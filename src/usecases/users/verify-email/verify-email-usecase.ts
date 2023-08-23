import { IUsersRepository } from "@/repositories/interface-users-repository";
import { EmailAlreadyExistsError } from "@/usecases/errors/email-already-exists-error";

interface IRequestVerifyEmail {
    token: string
    email: string
}

export class VerifyEmailUseCase{
    constructor(
        private usersRepository: IUsersRepository,

    ) {}

    async execute({
        token,
        email
    }:IRequestVerifyEmail):Promise<void>{
        const findUserByEmail = await this.usersRepository.findByEmail(email)

        if(!findUserByEmail){
            throw new EmailAlreadyExistsError()
        }

        // validar se token está expirado

        //atualizar emailActive para true
        await this.usersRepository.activeEmail(findUserByEmail.id)
    }
}