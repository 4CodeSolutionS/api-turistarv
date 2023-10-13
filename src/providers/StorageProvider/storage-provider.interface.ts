export interface IStorageProvider {
    uploadFile(fileName: string, pathFolder: string, folderStorage: 'turistarv'): Promise<string | undefined>;
}
