export interface IStorageProvider {
    uploadFile(fileName: string, pathFolder: string, folderStorage: 'posts' | 'announcements' | 'campings'): Promise<string | undefined>;
}
