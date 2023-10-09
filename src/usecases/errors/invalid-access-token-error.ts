export class InvalidAccessTokenError extends Error{
    constructor(){
        super('Chave token de acesso inválida!')
    }
}