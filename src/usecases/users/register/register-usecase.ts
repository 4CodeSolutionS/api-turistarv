import { env } from "@/env";
import { IUsersRepository } from "@/repositories/interface-users-repository";
import { CPFAlreadyExistsError } from "@/usecases/errors/cpf-already-exists-error";
import { EmailAlreadyExistsError } from "@/usecases/errors/email-already-exists-error";
import { PassportAlreadyExistsError } from "@/usecases/errors/passport-already-exists-error";
import { Tourist, User, Vehicle } from "@prisma/client";
import { hash } from 'bcrypt'
import 'dotenv/config'
import { randomUUID } from "crypto";
import { IDateProvider } from "@/providers/DateProvider/interface-date-provider";
import { ITokensRepository } from "@/repositories/interface-tokens-repository";
import { IMailProvider } from "@/providers/MailProvider/interface-mail-provider";

interface IRequestRegisterAccount {
    cpf?: string
    dateBirth: Date,
    email: string,
    gender: string,
    name: string,
    passport?: string,
    password: string,
    phone: string,
    rvLength: number,
    rvPlate: string,
    touristType: Tourist,
    tugPlate: string,
    vehicleType: Vehicle,
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
        cpf,
        dateBirth,
        email,
        gender,
        name,
        passport,
        password,
        phone,
        rvLength,
        rvPlate,
        touristType,
        tugPlate,
        vehicleType
    }:IRequestRegisterAccount):Promise<IResponseRegisterAccount>{
        const findEmailAlreadyExists = await this.usersRepository.findByEmail(email)

        if(findEmailAlreadyExists){
            throw new EmailAlreadyExistsError()
        }

        if(cpf){
            const findCPFAlreadyExists = await this.usersRepository.findByCPF(cpf)

            if(findCPFAlreadyExists){
                throw new CPFAlreadyExistsError()
            }
        }
        
        if(passport){
            const findPassportAlreadyExists = await this.usersRepository.findByPassport(passport)
            if(findPassportAlreadyExists){
                throw new PassportAlreadyExistsError()
            }
        }

        const criptingPassword = await hash(password, 8)

        const user = await this.usersRepository.create({
            cpf,
            dateBirth,
            email,
            gender,
            name,
            passport,
            password: criptingPassword,
            phone,
            rvLength,
            rvPlate,
            touristType,
            tugPlate,
            vehicleType
        })

        // pegar template de verificaçao de email
        const pathTemplate = './src/views/emails/verify-email.hbs'
        
        // gerar token valido por 3h
        const token = randomUUID()

        // gerar data em horas
        const expireDateHours = this.dayjsDateProvider.addHours(3)

        // salvar token no banco
       await this.usersTokensRepository.create({
            idUser: user.id,
            expireDate: expireDateHours,
            token
        })
        // formatar link com token
        const link = `${env.APP_URL_LOCAL}/users/verify-email?token=${token}`

        // enviar verificação de email
        // await this.sendMailProvider.sendEmail(
        //     email, 
        //     name,
        //     "Confirmação de email", 
        //     link, 
        //     pathTemplate
        // )

        return {
            user
        }
    }
}