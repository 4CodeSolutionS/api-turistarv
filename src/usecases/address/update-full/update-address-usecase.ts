import { IAddressesRepository } from '@/repositories/interface-addresses-repository';
import { IUsersRepository } from '@/repositories/interface-users-repository';
import { AppError } from '@/usecases/errors/app-error';


interface IResquestUpdateAddress{
    id: string;
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

export class UpdateAddressByIdUseCase {
    constructor(
        private addressRepository: IAddressesRepository,
        private usersRepository: IUsersRepository,
        ) {}

  async execute(
    {
      id,
      street,
      num,
      country,
      district,
      zipCode,
      idAnnouncement,
      idUser,
      city,
      state,
      complement,
      reference,
    }: IResquestUpdateAddress,
  ): Promise<any> {
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

    const checkAddressExists = await this.addressRepository.findById(id);

    if (!checkAddressExists) {
      throw new AppError("Endereço não encontrado", 404);
    }

    const address = await this.addressRepository.updateById({
        id,
        street,
        num,
        country,
        district,
        zipCode,
        city,
        state,
        complement,
        reference,
    });

    return address;
  }
}
