import { IAddressesRepository } from "@/repositories/interface-addresses-repository";
import { IUsersRepository } from "@/repositories/interface-users-repository";
import { AppError } from "@/usecases/errors/app-error";
import { Address } from "@prisma/client";

interface IResquestCreateAddress{
    street: string;
    num: number;
    city: string;
    state: string;
    zipCode: number;
    complement?: string;
    reference?: string;
    country: string;
    district: string;
    idAnnouncement?: string;
    idUser?: string;
}

export class CreateAddressUseCase {
  constructor(
    private addressRepository: IAddressesRepository,
    private usersRepository: IUsersRepository,
    ) {}

  async execute({
    street,
    num,
    city,
    state,
    zipCode,
    complement,
    reference,
    country,
    district,
    idAnnouncement,
    idUser,
  }: IResquestCreateAddress): Promise<Address> {

    if(idUser){
        // encontrar usuario pelo id
        const findUserExist = await this.usersRepository.findById(idUser)

        // validar se usuario existe
        if(!findUserExist){
            throw new AppError('Usuário não encontrado', 404)
        }
    }

    // if(idAnnouncement){

    // }
    
    const address = await this.addressRepository.create({
        street,
        num,
        city,
        state,
        zipCode,
        complement,
        reference,
        country,
        district,
        idAnnouncement,
        idUser,
    });

    return address;
  }
}
