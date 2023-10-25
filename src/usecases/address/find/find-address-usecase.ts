import { IAddressesRepository } from "@/repositories/interface-addresses-repository";
import { ResourceNotFoundError } from "@/usecases/errors/resource-not-found-error";
import { Address } from "@prisma/client";

interface IResquestFindAddress{
    id: string;
}

export class FindAddressByIdUseCase {
    constructor(
        private addressRepository: IAddressesRepository,
        ) {}

  async execute({id}:IResquestFindAddress): Promise<Address> {
    const checkAddressExists = await this.addressRepository.findById(id);

    if (!checkAddressExists) {
      throw new ResourceNotFoundError();
    }

    return checkAddressExists;
  }
}
