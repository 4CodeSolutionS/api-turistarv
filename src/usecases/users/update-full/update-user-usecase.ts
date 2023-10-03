import { IUsersRepository } from "@/repositories/interface-users-repository";
import { Tourist, User, Vehicle } from "@prisma/client";
import 'dotenv/config'
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";

interface IRequestUpdateUser {
    id: string,
    gender: string,
    name: string,
    phone: string,
    dateBirth: Date,
    rvLength: number,
    rvPlate: string,
    touristType: Tourist,
    tugPlate: string,
    vehicleType: Vehicle,
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
        gender,
        name,
        phone,
        dateBirth,
        rvLength,
        rvPlate,
        touristType,
        tugPlate,
        vehicleType
    }:IRequestUpdateUser):Promise<IResponseUpdateUser>{
        const findUserExists = await this.usersRepository.getUserSecurity(id)

        if(!findUserExists){
            throw new ResourceNotFoundError()
        }

       const userUpdated = await this.usersRepository.update({
            id,
            gender,
            name,
            phone,
            dateBirth,
            rvLength,
            rvPlate,
            touristType,
            tugPlate,
            vehicleType
        })
        
        return {
            user: userUpdated
        }
    }
}