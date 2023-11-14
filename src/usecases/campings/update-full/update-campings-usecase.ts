import { env } from "@/env"
import { IStorageProvider } from "@/providers/StorageProvider/storage-provider.interface"
import { ICampingsRepository } from "@/repositories/interface-campings-repository"
import { IImagesRepository } from "@/repositories/interface-images-repository"
import { AppError } from "@/usecases/errors/app-error"
import { Camping, Image } from "@prisma/client"

interface ICamping{
    id: string
    name: string
    propertyRules: string
    active: boolean
    description: string
    images: Image[]
}

interface IRequestUpdateCamping{
    idCamping: string
    name: string
    propertyRules: string
    active: boolean
    description: string
    fileNameImages: string[]
}

export class UpdateCampingUseCase {
    constructor(
        private campingRepository: ICampingsRepository,
        private storageProvider: IStorageProvider,
        private imageRepository: IImagesRepository
        ) {}

    async execute({
        idCamping,
        name,
        propertyRules,
        active,
        description,
        fileNameImages
    }: IRequestUpdateCamping): Promise<void>{
        // buscar camping pelo id
        const findCampingExist = await this.campingRepository.findById(idCamping) as ICamping

        // verificar se existe
        if(!findCampingExist){
            throw new AppError('Camping não existe', 404)
        }

        // buscar camping pelo nome
        const campingAlreadyExists = await this.campingRepository.findByName(name)

        // verificar se existe
        if(campingAlreadyExists){
            throw new AppError('Camping já existe', 409)
        }
        
        // criar constante com o caminho da pasta de imagens
        const pathFolder = env.NODE_ENV === "production" ? `${env.FOLDER_TMP_PRODUCTION}/campings` : `${env.FOLDER_TMP_DEVELOPMENT}/campings`

        //  criar variavel array de imagens que vai receber urls do firebase
        const arrayImagesUrl = []

        // criar loping cara fazer upload das imagens no firebase
        for(let fileName of fileNameImages){
            // fazer upload do exame dentro firebase através do nome do arquivo
            let urlUploded = await this.storageProvider.uploadFile(fileName, pathFolder, 'campings') as string

            // adicionar url do exame no array de imagens
            arrayImagesUrl.push(urlUploded)

            // for para atualizar imagens no banco
            for(let image of findCampingExist.images){
                // atualizar imagem no banco
                await this.imageRepository.updateUrl({
                    id: image.id,
                    url: urlUploded
                })
            }
        }

        // criar camping no banco de dados
        const camping = await this.campingRepository.updateById({
            id: idCamping,
            name,
            propertyRules,
            active,
            description,
        })
    }
}