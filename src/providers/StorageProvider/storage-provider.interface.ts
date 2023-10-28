export interface IStorageProvider {
    uploadFile(fileName: string, pathFolder: string, folderStorage: 'turistarv' | 'announcements'): Promise<string | undefined>;
}
