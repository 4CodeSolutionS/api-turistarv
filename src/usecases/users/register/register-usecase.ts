import { env } from "@/env";
import { IUsersRepository } from "@/repositories/interface-users-repository";
import { EmailAlreadyExistsError } from "@/usecases/errors/email-already-exists-error";
import { hash } from 'bcrypt'
import 'dotenv/config'
import { randomUUID } from "crypto";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { ITokensRepository } from "@/repositories/interface-tokens-repository";
import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";
import { User } from "@prisma/client";

interface IRequestRegisterAccount {
    email: string,
    name: string,
    password: string,
    phone?: string,
    rvLength?: number,
    rvPlate?: string,
    touristType?: 'CARAVANISTA' | 'ADMIRADOR',
    vehicleType?: 'MOTORHOME' | 'TRAILER' | 'CAMPER' | 'TENT',
}
interface IResponseRegisterAccount {
    user: User
}

export class RegisterUseCase{
    constructor(
        private usersRepository: IUsersRepository,
        private dayjsDateProvider: IDateProvider,
        private usersTokensRepository: ITokensRepository,
        private sendMailProvider: IMailProvider
    ) {}

    async execute({
        email,
        name,
        password,
        phone,
        rvLength,
        rvPlate,
        touristType,
        vehicleType
    }:IRequestRegisterAccount):Promise<IResponseRegisterAccount>{
        const findEmailAlreadyExists = await this.usersRepository.findByEmail(email)

        if(findEmailAlreadyExists){
            throw new EmailAlreadyExistsError()
        }


        const criptingPassword = await hash(password, 8)

        const user = await this.usersRepository.create({
            email,
            name,
            password: criptingPassword,
            phone,
        })

         // pegar template de verificaçao de email
         let pathTemplate = env.NODE_ENV === "development" ? 
         './views/emails/verify-email.hbs':
         './build/views/emails/verify-email.hbs' 
        
        // gerar token valido por 3h
        const token = randomUUID()
        console.log(token)
        // gerar data em horas
        const expireDateHours = this.dayjsDateProvider.addHours(3)

        // salvar token no banco
       await this.usersTokensRepository.create({
            idUser: user.id,
            expireDate: expireDateHours,
            token
        })
        // formatar link com token
        let link = env.NODE_ENV === "development" ?
        `${env.APP_URL_DEVLOPMENT}/users/verify-email?token=${token}`:
        `${env.APP_URL_PRODUCTION}/users/verify-email?token=${token}`

        // enviar verificação de email
        await this.sendMailProvider.sendEmail(
            email, 
            name,
            "Confirmação de email", 
            link, 
            pathTemplate
        )

        return {
            user
        }
    }
}