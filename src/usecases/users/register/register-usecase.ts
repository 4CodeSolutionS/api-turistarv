import { IUsersRepository } from "@/repositories/interface-users-repository";
import { CPFAlreadyExistsError } from "@/usecases/errors/cpf-already-exists-error";
import { EmailAlreadyExistsError } from "@/usecases/errors/email-already-exists-error";
import { PassportAlreadyExistsError } from "@/usecases/errors/passport-already-exists-error";
import { Tourist, User, Vehicle } from "@prisma/client";
import { hash } from 'bcrypt'

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

        const findCPFAlreadyExists = await this.usersRepository.findByCPF(cpf as string)

        if(findCPFAlreadyExists){
            throw new CPFAlreadyExistsError()
        }

        const findPassportAlreadyExists = await this.usersRepository.findByPassport(passport as string)
        
        if(findPassportAlreadyExists){
            throw new PassportAlreadyExistsError()
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

        return {
            user
        }
    }
}