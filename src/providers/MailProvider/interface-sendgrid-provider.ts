export interface ISendGridProvider {
    sendEmail(
        email: string, 
        name:string, 
        subject:string, 
        link:string, 
        pathTemplate:string
    ): Promise<void>
}