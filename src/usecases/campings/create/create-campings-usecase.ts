import { env } from "@/env"
import { IStorageProvider } from "@/providers/StorageProvider/storage-provider.interface"
import { ICampingsRepository } from "@/repositories/interface-campings-repository"
import { AppError } from "@/usecases/errors/app-error"
import { Camping } from "@prisma/client"

interface IRequestCreateCamping{
    name: string
    propertyRules: string
    active: boolean
    description: string
    areaImageName?: string
    fileNameImages: string[]
}

export class CreateCampingUseCase {
    constructor(
        private campingRepository: ICampingsRepository,
        private storageProvider: IStorageProvider
        ) {}

    async execute({
        name,
        propertyRules,
        active,
        description,
        areaImageName,
        fileNameImages
    }: IRequestCreateCamping): Promise<Camping>{
        // buscar camping pelo nome
        const campingAlreadyExists = await this.campingRepository.findByName(name)

        // verificar se existe
        if(campingAlreadyExists){
            throw new AppError('Camping já existe')
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
        }

        let uploadAreaImage = ''
        if(areaImageName){
            uploadAreaImage = await this.storageProvider.uploadFile(areaImageName, pathFolder, 'campings') as string
        }

        // criar camping no banco de dados
        const camping = await this.campingRepository.create({
            name,
            propertyRules,
            active,
            description,
            areaImage: areaImageName ? uploadAreaImage : null,
            images:{
                createMany:{
                   data: arrayImagesUrl.map(image => ({ url: image })) 
                }
            }
        })

        // retornar camping
        return camping
    }
}